import { BaseCommandFilter } from '@nyx-discord/base';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

/** A {@link BaseCommandFilter} for @discordjs/core command executions. */
export abstract class AbstractCommandFilter extends BaseCommandFilter<CoreInteractionTypes> {}
