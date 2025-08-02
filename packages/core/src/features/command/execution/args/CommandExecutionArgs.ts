import type { MetaCollection } from '../../../../meta/MetaCollection.js';
import type { CommandResolvableInteraction } from '../../interaction/CommandResolvableInteraction.js';

/** Type of arguments used to call a {@link ExecutableCommand}. */
export type CommandExecutionArgs = [
  CommandResolvableInteraction,
  MetaCollection,
];
