import { Collection } from '@discordjs/collection';
import type {
  Command,
  ContextMenuCommand,
  MetaCollection,
  Nameable,
  ParentCommand,
  ReadonlyMetaCollection,
  StandaloneCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/core';

export abstract class AbstractCommand<Data extends Nameable>
  implements Command<Data>
{
  protected abstract readonly data: Data;

  protected readonly meta: MetaCollection = new Collection();

  public isStandalone(): this is StandaloneCommand {
    return false;
  }

  public isParent(): this is ParentCommand {
    return false;
  }

  public isSubCommand(): this is SubCommand {
    return false;
  }

  public isSubCommandGroup(): this is SubCommandGroup {
    return false;
  }

  public isContextMenu(): this is ContextMenuCommand {
    return false;
  }

  public getMeta(): ReadonlyMetaCollection {
    return this.meta;
  }

  public getData(): Data {
    return this.data;
  }

  public abstract getNameTree(): ReadonlyArray<string>;
}
