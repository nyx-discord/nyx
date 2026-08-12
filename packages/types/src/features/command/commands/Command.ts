import type { Metadatable } from '../../../meta/Metadatable';
import type { Nameable } from '../../../types/Nameable';
import type { InteractionTypes } from '../InteractionTypes';
import type { ContextMenuCommand } from './ContextMenuCommand';
import type { ParentCommand } from './ParentCommand';
import type { StandaloneCommand } from './StandaloneCommand';
import type { SubCommand } from './SubCommand';
import type { SubCommandGroup } from './SubCommandGroup';

/** The base of every command that can be executed or stored by the bot. */
export interface Command<
  Data extends Nameable,
  Types extends InteractionTypes = InteractionTypes,
> extends Metadatable {
  /** Returns the data for this command. */
  getData(): Data;

  /** Returns whether this is a ParentCommand. */
  isParent(): this is ParentCommand<Types>;

  /** Returns whether this is an ContextMenuCommand. */
  isContextMenu(): this is ContextMenuCommand<Types>;

  /** Returns whether this is a StandaloneCommand. */
  isStandalone(): this is StandaloneCommand<Types>;

  /** Returns whether this is a SubCommand. */
  isSubCommand(): this is SubCommand<Types>;

  /** Returns whether this is a SubCommandGroup. */
  isSubCommandGroup(): this is SubCommandGroup<Types>;

  /** Returns the names of the tree of this command. */
  getNameTree(): ReadonlyArray<string>;
}
