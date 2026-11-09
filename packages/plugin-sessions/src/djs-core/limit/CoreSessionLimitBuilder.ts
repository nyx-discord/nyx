import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import { SessionLimitBuilder } from '../../shared/base/limit/limit/SessionLimitBuilder.js';

/** {@link SessionLimitBuilder} for @discordjs/core sessions. */
export class CoreSessionLimitBuilder extends SessionLimitBuilder<CoreInteractionTypes> {}
