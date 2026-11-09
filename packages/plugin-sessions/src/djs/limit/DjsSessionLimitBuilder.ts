import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { SessionLimitBuilder } from '../../shared/base/limit/limit/SessionLimitBuilder.js';

/** {@link SessionLimitBuilder} for discord.js sessions. */
export class DjsSessionLimitBuilder extends SessionLimitBuilder<DjsInteractionTypes> {}
