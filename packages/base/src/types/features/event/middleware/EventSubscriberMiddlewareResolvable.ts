import type { MiddlewareResolvableFrom } from '#types/middleware/MiddlewareResolvable';
import type { EventSubscriberMiddleware } from './EventSubscriberMiddleware';

export type EventSubscriberMiddlewareResolvable =
  MiddlewareResolvableFrom<EventSubscriberMiddleware>;
