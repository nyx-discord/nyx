import type { CommandExecutionArgs } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** Type of arguments used to call a discord.js command. */
export type DjsCommandExecutionArgs = CommandExecutionArgs<DjsInteractionTypes>;
