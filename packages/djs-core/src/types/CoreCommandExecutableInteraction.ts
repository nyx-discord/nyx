import type { CommandExecutableInteraction } from '@nyx-discord/base';
import type { CoreInteractionTypes } from './CoreInteractionTypes.js';

/** Type of interactions that could execute a @discordjs/core command. */
export type CoreCommandExecutableInteraction =
  CommandExecutableInteraction<CoreInteractionTypes>;
