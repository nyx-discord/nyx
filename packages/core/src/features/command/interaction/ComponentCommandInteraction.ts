import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

/** Type of component interactions that could execute a {@link ExecutableCommand}, based on their customId. */
export type ComponentCommandInteraction =
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;
