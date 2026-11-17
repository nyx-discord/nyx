import type { CommandEventArgs } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

/** Record of arguments for each @discordjs/core command event. */
export type CoreCommandEventArgs = CommandEventArgs<CoreInteractionTypes>;
