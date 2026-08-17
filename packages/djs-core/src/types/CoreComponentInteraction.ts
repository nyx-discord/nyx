import type { ComponentCommandInteraction } from '@nyx-discord/types';
import type { CoreInteractionTypes } from './CoreInteractionTypes.js';

/** Type of component interaction contexts for @discordjs/core. */
export type CoreComponentInteraction =
  ComponentCommandInteraction<CoreInteractionTypes>;
