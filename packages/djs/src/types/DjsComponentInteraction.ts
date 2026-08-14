import type { ComponentCommandInteraction } from '@nyx-discord/types';
import type { DjsInteractionTypes } from './DjsInteractionTypes.js';

/** Type of component interactions for discord.js. */
export type DjsComponentInteraction =
  ComponentCommandInteraction<DjsInteractionTypes>;
