import type { ApplicationCommandInteraction } from '@nyx-discord/base';
import type { DjsInteractionTypes } from './DjsInteractionTypes.js';

/** Type of application command interactions for discord.js. */
export type DjsCommandInteraction =
  ApplicationCommandInteraction<DjsInteractionTypes>;
