import type { MiddlewareResolvableFrom } from '@nyx-discord/framework';
import type { SessionStartMiddleware } from './SessionStartMiddleware';

export type SessionStartMiddlewareResolvable =
  MiddlewareResolvableFrom<SessionStartMiddleware>;
