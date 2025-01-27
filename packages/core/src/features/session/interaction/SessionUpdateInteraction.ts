import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalMessageModalSubmitInteraction,
} from 'discord.js';

/** An interaction that triggers a {@link Session} update. */
export type SessionUpdateInteraction =
  | AnySelectMenuInteraction
  | ButtonInteraction
  | ModalMessageModalSubmitInteraction;
