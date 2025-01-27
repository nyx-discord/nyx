import type { Awaitable } from 'discord.js';
import type { ErrorHandlerContainer } from '../../../../error/handler/ErrorHandlerContainer.js';
import type { MiddlewareListContainer } from '../../../../middleware/list/MiddlewareListContainer.js';
import type { EventSubscriberMiddleware } from '../../middleware/EventSubscriberMiddleware.js';
import type { EventSubscriberErrorHandler } from '../../subscriber/error/EventSubscriberErrorHandler.js';
import type { AnyEventSubscriber } from '../../subscriber/types/AnyEventSubscriber';

/**
 * An object for dispatching events to an array of {@link EventSubscriber},
 * performing middleware and error catching logic in the process.
 */
export interface EventDispatcher
  extends MiddlewareListContainer<EventSubscriberMiddleware>,
    ErrorHandlerContainer<EventSubscriberErrorHandler> {
  /** Notifies a given subscriber array about an event, using the passed args. */
  dispatch(
    subscribers: AnyEventSubscriber[],
    args: Parameters<(typeof subscribers)[number]['handleEvent']>,
  ): Awaitable<void>;
}
