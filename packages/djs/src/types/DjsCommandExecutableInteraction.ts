import type { CommandExecutableInteraction } from '@nyx-discord/base';
import type { DjsInteractionTypes } from './DjsInteractionTypes.js';

/** Type of interactions that could execute a discord.js command. */
export type DjsCommandExecutableInteraction =
  CommandExecutableInteraction<DjsInteractionTypes>;
