import type { CommandResolvableInteraction } from '@nyx-discord/base';
import type { CoreInteractionTypes } from './CoreInteractionTypes.js';

/** Type of interactions that could be resolved to a @discordjs/core command. */
export type CoreCommandResolvableInteraction =
  CommandResolvableInteraction<CoreInteractionTypes>;
