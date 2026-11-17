import { BaseCommandMiddleware } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

/** A {@link BaseCommandMiddleware} for @discordjs/core command executions. */
export abstract class AbstractCommandMiddleware extends BaseCommandMiddleware<CoreInteractionTypes> {}
