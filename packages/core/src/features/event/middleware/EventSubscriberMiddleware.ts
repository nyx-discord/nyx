import type { Middleware } from '../../../middleware/Middleware.js';
import type { EventDispatchArgs } from '../dispatch/args/EventDispatchArgs.js';
import type { AnyEventSubscriber } from '../subscriber/types/AnyEventSubscriber';

/** {@link Middleware} that can handle {@link EventSubscriber} executions. */
export interface EventSubscriberMiddleware
  extends Middleware<AnyEventSubscriber, EventDispatchArgs> {}
