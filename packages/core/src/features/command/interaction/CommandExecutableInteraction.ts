import type { ApplicationCommandInteraction } from './ApplicationCommandInteraction.js';
import type { ComponentCommandInteraction } from './ComponentCommandInteraction.js';

/** Type of interactions that could execute a {@link ExecutableCommand}. */
export type CommandExecutableInteraction =
  | ComponentCommandInteraction
  | ApplicationCommandInteraction;
