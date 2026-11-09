import type {
  InteractionTypes,
  MiddlewareResolvableFrom,
} from '@nyx-discord/base';
import type { SessionStartMiddleware } from './SessionStartMiddleware.js';

export type SessionStartMiddlewareResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = MiddlewareResolvableFrom<SessionStartMiddleware<Types>>;
