import type { MiddlewareResolvableFrom } from '../../../middleware/MiddlewareResolvable';
import type { EventSubscriberMiddleware } from './EventSubscriberMiddleware';

export type EventSubscriberMiddlewareResolvable =
  MiddlewareResolvableFrom<EventSubscriberMiddleware>;
