import type { Metadata } from '../../../../meta/Metadata';
import type { InteractionTypes } from '../../InteractionTypes';
import type { CommandResolvableInteraction } from '../../interaction/CommandResolvableInteraction.js';

/** Type of arguments used to call a {@link ExecutableCommand}. */
export type CommandExecutionArgs<
  Types extends InteractionTypes = InteractionTypes,
> = [CommandResolvableInteraction<Types>, Metadata];
