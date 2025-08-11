import type {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
} from 'discord.js';

/** Type of concrete application command interactions. */
export type ApplicationCommandInteraction =
  | ChatInputCommandInteraction
  | ContextMenuCommandInteraction;
