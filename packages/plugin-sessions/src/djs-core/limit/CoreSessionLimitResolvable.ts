import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { SessionLimitResolvable } from '../../shared/types/limit/limit/SessionLimitResolvable.js';

export type CoreSessionLimitResolvable =
  SessionLimitResolvable<CoreInteractionTypes>;
