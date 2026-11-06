import type { InteractionTypes } from '../InteractionTypes.js';
import type { ApplicationCommandInteraction } from './ApplicationCommandInteraction.js';
import type { ComponentCommandInteraction } from './ComponentCommandInteraction.js';

/** Type of interactions that could execute a {@link ExecutableCommand}. */
export type CommandExecutableInteraction<Types extends InteractionTypes> =
  ComponentCommandInteraction<Types> | ApplicationCommandInteraction<Types>;
