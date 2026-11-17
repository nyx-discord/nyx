import type { CommandErrorHandler } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** A {@link CommandErrorHandler} for discord.js command executions. */
export type DjsCommandErrorHandler = CommandErrorHandler<DjsInteractionTypes>;
