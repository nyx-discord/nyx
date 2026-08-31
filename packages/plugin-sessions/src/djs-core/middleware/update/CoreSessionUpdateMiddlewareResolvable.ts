import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { SessionUpdateMiddlewareResolvable } from '../../../shared/types/middleware/update/SessionUpdateMiddlewareResolvable.js';

export type CoreSessionUpdateMiddlewareResolvable =
  SessionUpdateMiddlewareResolvable<CoreInteractionTypes>;
