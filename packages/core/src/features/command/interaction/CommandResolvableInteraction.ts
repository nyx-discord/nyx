import type { AutocompleteInteraction } from 'discord.js';
import type { CommandExecutableInteraction } from './CommandExecutableInteraction.js';

/** Type of interactions that could be resolved to a {@link ExecutableCommand}. */
export type CommandResolvableInteraction =
  | CommandExecutableInteraction
  | AutocompleteInteraction;
