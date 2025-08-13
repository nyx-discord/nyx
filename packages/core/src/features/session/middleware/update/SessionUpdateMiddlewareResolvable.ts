import type { MiddlewareResolvableFrom } from '../../../../middleware/MiddlewareResolvable';
import type { SessionUpdateMiddleware } from './SessionUpdateMiddleware';

export type SessionUpdateMiddlewareResolvable =
  MiddlewareResolvableFrom<SessionUpdateMiddleware>;
