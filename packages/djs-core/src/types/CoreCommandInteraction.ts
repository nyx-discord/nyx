import type { ApplicationCommandInteraction } from '@nyx-discord/base';
import type { CoreInteractionTypes } from './CoreInteractionTypes.js';

/** Type of application command interaction contexts for @discordjs/core. */
export type CoreCommandInteraction =
  ApplicationCommandInteraction<CoreInteractionTypes>;
