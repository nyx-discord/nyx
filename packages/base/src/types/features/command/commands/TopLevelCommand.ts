import type { InteractionTypes } from '../InteractionTypes';
import type { ContextMenuCommand } from './ContextMenuCommand';
import type { ParentCommand } from './ParentCommand.js';
import type { StandaloneCommand } from './StandaloneCommand';

/** Type of supported top level commands. */
export type TopLevelCommand<Types extends InteractionTypes = InteractionTypes> =
  ParentCommand<Types> | StandaloneCommand<Types> | ContextMenuCommand<Types>;
