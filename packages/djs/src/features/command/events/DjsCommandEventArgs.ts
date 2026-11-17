import type { CommandEventArgs } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** Record of arguments for each discord.js command event. */
export type DjsCommandEventArgs = CommandEventArgs<DjsInteractionTypes>;
