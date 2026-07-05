import type { ApplicationCommandInteraction } from '@nyx-discord/framework';
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

/** An interaction that triggers a {@link Session} start. */
export type SessionStartInteraction =
  | ApplicationCommandInteraction
  | AnySelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction;
