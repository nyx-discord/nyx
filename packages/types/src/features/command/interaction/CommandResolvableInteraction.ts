import type { InteractionTypes } from '../InteractionTypes.js';
import type { CommandExecutableInteraction } from './CommandExecutableInteraction.js';

/** Type of interactions that could be resolved to a {@link ExecutableCommand}. */
export type CommandResolvableInteraction<Types extends InteractionTypes> =
  CommandExecutableInteraction<Types> | Types['AutocompleteInteraction'];
