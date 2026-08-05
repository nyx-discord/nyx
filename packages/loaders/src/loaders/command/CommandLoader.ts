import type {
  Constructor,
  NyxBot,
  ParentCommand,
  SubCommand,
  SubCommandGroup,
  TopLevelCommand,
} from '@nyx-discord/framework';
import {
  AbstractContextMenuCommand,
  AbstractParentCommand,
  AbstractStandaloneCommand,
  AbstractSubCommand,
  AbstractSubCommandGroup,
} from '@nyx-discord/framework';
import { readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { LoaderError } from '../../error/LoaderError';
import { ModuleUtils } from '../../util/ModuleUtils';
import { ObjectInstantiator } from '../../util/ObjectInstantiator';
import { LoaderOptions } from '../LoaderOptions';

interface ClassifiedRoot {
  type: 'standalone' | 'parent' | 'contextMenu';
  Class: Constructor<object>;
  file: string;
}

interface ClassifiedChild {
  type: 'subCommand' | 'subCommandGroup';
  Class: Constructor<object>;
  file: string;
}

interface CommandInstances {
  standaloneCommands: object[];
  contextMenuCommands: object[];
  parentCommands: Array<{ instance: ParentCommand }>;
  subCommandInstances: object[];
  subCommandGroupInstances: Array<{ instance: SubCommandGroup }>;
}

function emptyInstances(): CommandInstances {
  return {
    standaloneCommands: [],
    contextMenuCommands: [],
    parentCommands: [],
    subCommandInstances: [],
    subCommandGroupInstances: [],
  };
}

export class CommandLoader {
  public static async load(options: LoaderOptions): Promise<TopLevelCommand[]> {
    const commands = (await this.loadRoot(
      options.path,
      options.bot,
      undefined,
      options.filter,
    )) as TopLevelCommand[];

    if (!options.register) return commands;

    await options.bot.getCommandManager().addCommands(...commands);
    return commands;
  }

  private static async loadRoot(
    dir: string,
    bot: NyxBot,
    parent?: object,
    filter?: (filePath: string) => boolean,
  ): Promise<object[]> {
    const isChildContext = parent !== undefined;

    const { rootClasses, childClasses, errors } = await this.scanDir(
      dir,
      isChildContext,
      filter,
    );

    const instances = this.instantiateCommands(
      rootClasses,
      childClasses,
      bot,
      parent,
      errors,
    );

    if (errors.length) {
      throw new LoaderError(dir, errors.join('\n'));
    }

    const claimedDirs = await this.wireChildren(
      dir,
      bot,
      filter,
      instances.parentCommands,
      instances.subCommandGroupInstances,
    );

    const extraRootCommands = await this.collectUnclaimed(
      dir,
      bot,
      filter,
      claimedDirs,
    );

    return this.assembleResult(isChildContext, instances, extraRootCommands);
  }

  private static async scanDir(
    dir: string,
    isChildContext: boolean,
    filter?: (filePath: string) => boolean,
  ): Promise<{
    rootClasses: ClassifiedRoot[];
    childClasses: ClassifiedChild[];
    errors: string[];
  }> {
    const files = await ModuleUtils.recurseDir(dir, filter);
    const errors: string[] = [];
    const rootClasses: ClassifiedRoot[] = [];
    const childClasses: ClassifiedChild[] = [];

    for (const file of files) {
      if (dirname(file) !== dir) continue;

      const mod = await ModuleUtils.importModule(file);
      for (const [exportName, exported] of Object.entries(mod)) {
        if (!ModuleUtils.isConstructor(exported)) continue;

        if (isChildContext) {
          this.classifyChildExport(
            exported,
            file,
            exportName,
            childClasses,
            errors,
          );
        } else {
          this.classifyRootExport(
            exported,
            file,
            exportName,
            rootClasses,
            errors,
          );
        }
      }
    }

    return { rootClasses, childClasses, errors };
  }

  private static classifyRootExport(
    exported: Constructor<object>,
    file: string,
    exportName: string,
    rootClasses: ClassifiedRoot[],
    errors: string[],
  ): void {
    const root = this.classifyRoot(exported);
    if (root) {
      root.file = file;
      rootClasses.push(root);
    } else if (this.classifyChild(exported)) {
      errors.push(
        `Export "${exportName}" at "${file}": SubCommand/SubCommandGroup must be in a children folder`,
      );
    } else {
      errors.push(
        `Export "${exportName}" at "${file}": export is not a recognized command type`,
      );
    }
  }

  private static classifyChildExport(
    exported: Constructor<object>,
    file: string,
    exportName: string,
    childClasses: ClassifiedChild[],
    errors: string[],
  ): void {
    const child = this.classifyChild(exported);
    if (child) {
      child.file = file;
      childClasses.push(child);
    } else if (this.classifyRoot(exported)) {
      errors.push(
        `Export "${exportName}" at "${file}": children folder can only contain SubCommand/SubCommandGroup`,
      );
    } else {
      errors.push(
        `Export "${exportName}" at "${file}": export is not a recognized command type`,
      );
    }
  }

  private static instantiateCommands(
    rootClasses: ClassifiedRoot[],
    childClasses: ClassifiedChild[],
    bot: NyxBot,
    parent: object | undefined,
    errors: string[],
  ): CommandInstances {
    const instances = emptyInstances();

    for (const classified of rootClasses) {
      try {
        const instance = ObjectInstantiator.instantiateModule(
          classified.Class,
          bot,
          parent,
          classified.file,
        );
        switch (classified.type) {
          case 'standalone':
            instances.standaloneCommands.push(instance);
            break;
          case 'contextMenu':
            instances.contextMenuCommands.push(instance);
            break;
          case 'parent':
            instances.parentCommands.push({
              instance: instance as unknown as ParentCommand,
            });
            break;
        }
      } catch (error) {
        errors.push(
          `Failed to instantiate at "${classified.file}": ${(error as Error).message}`,
        );
      }
    }

    for (const classified of childClasses) {
      try {
        const instance = ObjectInstantiator.instantiateModule(
          classified.Class,
          bot,
          parent,
          classified.file,
        );
        switch (classified.type) {
          case 'subCommand':
            instances.subCommandInstances.push(instance);
            break;
          case 'subCommandGroup':
            instances.subCommandGroupInstances.push({
              instance: instance as unknown as SubCommandGroup,
            });
            break;
        }
      } catch (error) {
        errors.push(
          `Failed to instantiate at "${classified.file}": ${(error as Error).message}`,
        );
      }
    }

    return instances;
  }

  private static async wireChildren(
    dir: string,
    bot: NyxBot,
    filter: ((filePath: string) => boolean) | undefined,
    parentCommands: Array<{ instance: ParentCommand }>,
    subCommandGroupInstances: Array<{ instance: SubCommandGroup }>,
  ): Promise<Set<string>> {
    const claimedDirs = new Set<string>();

    for (const { instance: parentCmd } of parentCommands) {
      const name = parentCmd.getData().name;
      const childDir = join(dir, name);
      if (await this.dirExists(childDir)) {
        claimedDirs.add(name);
        const children = await this.loadRoot(childDir, bot, parentCmd, filter);
        parentCmd.addChildren(
          ...(children as Array<SubCommand | SubCommandGroup>),
        );
      }
    }

    for (const { instance: groupCmd } of subCommandGroupInstances) {
      const name = groupCmd.getData().name;
      const childDir = join(dir, name);
      if (await this.dirExists(childDir)) {
        claimedDirs.add(name);
        const children = await this.loadRoot(childDir, bot, groupCmd, filter);
        groupCmd.addChildren(...(children as SubCommand[]));
      }
    }

    return claimedDirs;
  }

  private static async collectUnclaimed(
    dir: string,
    bot: NyxBot,
    filter: ((filePath: string) => boolean) | undefined,
    claimedDirs: Set<string>,
  ): Promise<object[]> {
    const extraRootCommands: object[] = [];

    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (claimedDirs.has(entry.name)) continue;

        const subDir = join(dir, entry.name);
        const nested = await this.loadRoot(subDir, bot, undefined, filter);
        extraRootCommands.push(...nested);
      }
    } catch {
      // Directory may not exist or be unreadable
    }

    return extraRootCommands;
  }

  private static assembleResult(
    isChildContext: boolean,
    instances: CommandInstances,
    extraRootCommands: object[],
  ): object[] {
    if (isChildContext) {
      return [
        ...instances.subCommandInstances,
        ...instances.subCommandGroupInstances.map((g) => g.instance),
      ];
    }

    return [
      ...instances.parentCommands.map((p) => p.instance),
      ...instances.standaloneCommands,
      ...instances.contextMenuCommands,
      ...extraRootCommands,
    ];
  }

  private static classifyRoot(
    value: Constructor<object>,
  ): ClassifiedRoot | null {
    const proto = value.prototype;
    if (!proto) return null;

    if (proto instanceof AbstractStandaloneCommand) {
      return { type: 'standalone', Class: value, file: '' };
    }
    if (proto instanceof AbstractParentCommand) {
      return { type: 'parent', Class: value, file: '' };
    }
    if (proto instanceof AbstractContextMenuCommand) {
      return { type: 'contextMenu', Class: value, file: '' };
    }
    return null;
  }

  private static classifyChild(
    value: Constructor<object>,
  ): ClassifiedChild | null {
    const proto = value.prototype;
    if (!proto) return null;

    if (proto instanceof AbstractSubCommand) {
      return { type: 'subCommand', Class: value, file: '' };
    }
    if (proto instanceof AbstractSubCommandGroup) {
      return { type: 'subCommandGroup', Class: value, file: '' };
    }
    return null;
  }

  private static async dirExists(path: string): Promise<boolean> {
    try {
      const stats = await stat(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
}
