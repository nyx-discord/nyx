import { BaseCommandFilter } from '@nyx-discord/base';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

/** A {@link BaseCommandFilter} for discord.js command executions. */
export abstract class AbstractCommandFilter extends BaseCommandFilter<DjsInteractionTypes> {}
