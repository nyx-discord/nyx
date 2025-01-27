import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

import type { ApplicationCommandInteraction } from '../../command/interaction/ApplicationCommandInteraction.js';

/** An interaction that triggers a {@link Session} start. */
export type SessionStartInteraction =
  | ApplicationCommandInteraction
  | AnySelectMenuInteraction
  | ButtonInteraction
  | ModalSubmitInteraction;
