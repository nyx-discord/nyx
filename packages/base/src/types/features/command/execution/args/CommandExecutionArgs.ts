import type { Metadata } from '#types/meta/Metadata';
import type { CommandResolvableInteraction } from '../../interaction/CommandResolvableInteraction.js';
import type { InteractionTypes } from '../../InteractionTypes';

/** Type of arguments used to call a {@link ExecutableCommand}. */
export type CommandExecutionArgs<
  Types extends InteractionTypes = InteractionTypes,
> = [CommandResolvableInteraction<Types>, Metadata];
