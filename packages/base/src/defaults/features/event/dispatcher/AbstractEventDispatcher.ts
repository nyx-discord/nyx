import type { EventDispatchArgs } from '#types/features/event/dispatch/args/EventDispatchArgs';
import type { EventDispatcher } from '#types/features/event/dispatch/dispatcher/EventDispatcher';
import { EventSubscriberMiddlewareError } from '#types/features/event/middleware/errors/EventSubscriberMiddlewareError';
import { UncaughtEventSubscriberMiddlewareError } from '#types/features/event/middleware/errors/UncaughtEventSubscriberMiddlewareError';
import type { EventSubscriberMiddlewareResolvable } from '#types/features/event/middleware/EventSubscriberMiddlewareResolvable';
import type { EventSubscriberErrorHandler } from '#types/features/event/subscriber/error/EventSubscriberErrorHandler';
import type { AnyEventSubscriber } from '#types/features/event/subscriber/types/AnyEventSubscriber';
import type { MiddlewareList } from '#types/middleware/list/MiddlewareList';

export abstract class AbstractEventDispatcher implements EventDispatcher {
  protected readonly errorHandler: EventSubscriberErrorHandler;

  protected readonly middleware: MiddlewareList<EventSubscriberMiddlewareResolvable>;

  constructor(
    errorHandler: EventSubscriberErrorHandler,
    middleware: MiddlewareList<EventSubscriberMiddlewareResolvable>,
  ) {
    this.errorHandler = errorHandler;
    this.middleware = middleware;
  }

  public getErrorHandler(): EventSubscriberErrorHandler {
    return this.errorHandler;
  }

  public getMiddleware(): MiddlewareList<EventSubscriberMiddlewareResolvable> {
    return this.middleware;
  }

  public abstract dispatch(
    subscribers: AnyEventSubscriber[],
    args: Parameters<(typeof subscribers)[number]['handleEvent']>,
  ): Promise<void>;

  /**
   * Wraps a middleware error in an {@link UncaughtEventSubscriberMiddlewareError} if
   * it isn't an {@link EventSubscriberMiddlewareError}.
   */
  protected wrapMiddlewareError(
    error: Error,
    subscriber: AnyEventSubscriber,
    args: EventDispatchArgs,
  ): Error {
    if (error instanceof EventSubscriberMiddlewareError) {
      return error;
    }

    return new UncaughtEventSubscriberMiddlewareError(
      error,
      this.middleware,
      subscriber,
      args,
    );
  }
}
