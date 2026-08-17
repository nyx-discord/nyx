import type { ApplicationCommandInteraction } from '@nyx-discord/types';
import type { CoreInteractionTypes } from './CoreInteractionTypes.js';

/** Type of application command interaction contexts for @discordjs/core. */
export type CoreCommandInteraction =
  ApplicationCommandInteraction<CoreInteractionTypes>;
