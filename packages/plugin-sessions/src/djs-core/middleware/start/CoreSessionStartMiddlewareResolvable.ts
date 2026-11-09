import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { SessionStartMiddlewareResolvable } from '../../../shared/types/middleware/start/SessionStartMiddlewareResolvable.js';

export type CoreSessionStartMiddlewareResolvable =
  SessionStartMiddlewareResolvable<CoreInteractionTypes>;
