import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionUpdateMiddlewareResolvable } from '../../../shared/types/middleware/update/SessionUpdateMiddlewareResolvable.js';

export type DjsSessionUpdateMiddlewareResolvable =
  SessionUpdateMiddlewareResolvable<DjsInteractionTypes>;
