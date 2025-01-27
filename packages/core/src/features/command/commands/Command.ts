import type { Metadatable } from '../../../meta/Metadatable';
import type { ContextMenuCommand } from './ContextMenuCommand';
import type { ParentCommand } from './ParentCommand';
import type { StandaloneCommand } from './StandaloneCommand';
import type { SubCommand } from './SubCommand';
import type { SubCommandGroup } from './SubCommandGroup';

/** The base of every command that can be executed or stored by the bot. */
export interface Command<Data> extends Metadatable {
  /** Returns the data for this command. */
  getData(): Data;

  /** Returns the name of this command. */
  getName(): string;

  /** Returns whether this is a ParentCommand. */
  isParent(): this is ParentCommand;

  /** Returns whether this is an ContextMenuCommand. */
  isContextMenu(): this is ContextMenuCommand;

  /** Returns whether this is a StandaloneCommand. */
  isStandalone(): this is StandaloneCommand;

  /** Returns whether this is a SubCommand. */
  isSubCommand(): this is SubCommand;

  /** Returns whether this is a SubCommandGroup. */
  isSubCommandGroup(): this is SubCommandGroup;

  /** Returns the names of the tree of this command. */
  getNameTree(): ReadonlyArray<string>;
}
