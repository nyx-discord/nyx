import type { CommandResolvableInteraction } from '../../interaction/CommandResolvableInteraction.js';
import type { CommandExecutionMeta } from '../meta/CommandExecutionMeta.js';

/** Type of arguments used to call a {@link ExecutableCommand}. */
export type CommandExecutionArgs = [
  CommandResolvableInteraction,
  CommandExecutionMeta,
];
