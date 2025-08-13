import type { MiddlewareResolvableFrom } from '../../../../middleware/MiddlewareResolvable';
import type { SessionStartMiddleware } from './SessionStartMiddleware';

export type SessionStartMiddlewareResolvable =
  MiddlewareResolvableFrom<SessionStartMiddleware>;
