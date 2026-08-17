import type {
  InteractionTypes,
  MiddlewareResolvableFrom,
} from '@nyx-discord/types';
import type { SessionStartMiddleware } from './SessionStartMiddleware.js';

export type SessionStartMiddlewareResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = MiddlewareResolvableFrom<SessionStartMiddleware<Types>>;
