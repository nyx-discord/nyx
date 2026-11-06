import type { Command } from '#types/features/command/commands/Command';
import type { ContextMenuCommand } from '#types/features/command/commands/ContextMenuCommand';
import type { ParentCommand } from '#types/features/command/commands/ParentCommand';
import type { StandaloneCommand } from '#types/features/command/commands/StandaloneCommand';
import type { SubCommand } from '#types/features/command/commands/SubCommand';
import type { SubCommandGroup } from '#types/features/command/commands/SubCommandGroup';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { Metadata } from '#types/meta/Metadata';
import type { ReadonlyMetadata } from '#types/meta/ReadonlyMetadata';
import type { Nameable } from '#types/types/Nameable';

export abstract class BaseCommand<
  Data extends Nameable,
  Types extends InteractionTypes = InteractionTypes,
> implements Command<Data, Types> {
  protected abstract readonly data: Data;

  protected readonly meta: Metadata = Object.create(null);

  public isStandalone(): this is StandaloneCommand<Types> {
    return false;
  }

  public isParent(): this is ParentCommand<Types> {
    return false;
  }

  public isSubCommand(): this is SubCommand<Types> {
    return false;
  }

  public isSubCommandGroup(): this is SubCommandGroup<Types> {
    return false;
  }

  public isContextMenu(): this is ContextMenuCommand<Types> {
    return false;
  }

  public getMeta(): ReadonlyMetadata {
    return this.meta;
  }

  public getData(): Data {
    return this.data;
  }

  public abstract getNameTree(): ReadonlyArray<string>;
}
