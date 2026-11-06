import type { InteractionTypes } from '../InteractionTypes.js';

/** Type of component interactions that could execute a {@link ExecutableCommand}, based on their customId. */
export type ComponentCommandInteraction<Types extends InteractionTypes> =
  | Types['ButtonInteraction']
  | Types['SelectMenuInteraction']
  | Types['ModalSubmitInteraction'];
