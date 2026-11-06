import type { ErrorHandlerContainer } from '#types/error/handler/ErrorHandlerContainer';
import type { MiddlewareListContainer } from '#types/middleware/list/MiddlewareListContainer';
import type { Awaitable } from '#types/types/Awaitable';
import type { EventSubscriberMiddlewareResolvable } from '../../middleware/EventSubscriberMiddlewareResolvable';
import type { EventSubscriberErrorHandler } from '../../subscriber/error/EventSubscriberErrorHandler.js';
import type { AnyEventSubscriber } from '../../subscriber/types/AnyEventSubscriber';

/**
 * An object for dispatching events to an array of {@link EventSubscriber},
 * performing middleware and error catching logic in the process.
 */
export interface EventDispatcher
  extends
    MiddlewareListContainer<EventSubscriberMiddlewareResolvable>,
    ErrorHandlerContainer<EventSubscriberErrorHandler> {
  /** Notifies a given subscriber array about an event, using the passed args. */
  dispatch(
    subscribers: AnyEventSubscriber[],
    args: Parameters<(typeof subscribers)[number]['handleEvent']>,
  ): Awaitable<void>;
}
