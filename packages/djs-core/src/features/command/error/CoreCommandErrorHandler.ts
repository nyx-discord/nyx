import type { CommandErrorHandler } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

/** A {@link CommandErrorHandler} for @discordjs/core command executions. */
export type CoreCommandErrorHandler = CommandErrorHandler<CoreInteractionTypes>;
