import { BaseCommandMiddleware } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** A {@link BaseCommandMiddleware} for discord.js command executions. */
export abstract class AbstractCommandMiddleware extends BaseCommandMiddleware<DjsInteractionTypes> {}
