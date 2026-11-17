import type { CommandResolvableInteraction } from '@nyx-discord/base';
import type { DjsInteractionTypes } from './DjsInteractionTypes.js';

/** Type of interactions that could be resolved to a discord.js command. */
export type DjsCommandResolvableInteraction =
  CommandResolvableInteraction<DjsInteractionTypes>;
