import type { ContextMenuCommand } from './ContextMenuCommand';
import type { ParentCommand } from './ParentCommand.js';
import type { StandaloneCommand } from './StandaloneCommand';

/** Type of supported top level commands. */
export type TopLevelCommand =
  | ParentCommand
  | StandaloneCommand
  | ContextMenuCommand;
