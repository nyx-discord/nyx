import type {
  Command,
  ContextMenuCommand,
  InteractionTypes,
  Metadata,
  Nameable,
  ParentCommand,
  ReadonlyMetadata,
  StandaloneCommand,
  SubCommand,
  SubCommandGroup,
} from '@nyx-discord/types';

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
