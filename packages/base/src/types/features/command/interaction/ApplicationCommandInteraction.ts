import type { InteractionTypes } from '../InteractionTypes.js';

/** Type of concrete application command interactions. */
export type ApplicationCommandInteraction<Types extends InteractionTypes> =
  Types['ChatInputInteraction'] | Types['ContextMenuInteraction'];
