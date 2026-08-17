import type {
  InteractionTypes,
  MiddlewareResolvableFrom,
} from '@nyx-discord/types';
import type { SessionUpdateMiddleware } from './SessionUpdateMiddleware.js';

export type SessionUpdateMiddlewareResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = MiddlewareResolvableFrom<SessionUpdateMiddleware<Types>>;
