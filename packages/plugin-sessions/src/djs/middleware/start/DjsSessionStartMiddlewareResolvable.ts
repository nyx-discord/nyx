import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionStartMiddlewareResolvable } from '../../../shared/types/middleware/start/SessionStartMiddlewareResolvable.js';

export type DjsSessionStartMiddlewareResolvable =
  SessionStartMiddlewareResolvable<DjsInteractionTypes>;
