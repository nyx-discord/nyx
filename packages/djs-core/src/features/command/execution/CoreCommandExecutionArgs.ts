import type { CommandExecutionArgs } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

/** Type of arguments used to call a @discordjs/core command. */
export type CoreCommandExecutionArgs =
  CommandExecutionArgs<CoreInteractionTypes>;
