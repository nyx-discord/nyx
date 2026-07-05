import type { MiddlewareResolvableFrom } from '@nyx-discord/framework';
import type { SessionUpdateMiddleware } from './SessionUpdateMiddleware';

export type SessionUpdateMiddlewareResolvable =
  MiddlewareResolvableFrom<SessionUpdateMiddleware>;
