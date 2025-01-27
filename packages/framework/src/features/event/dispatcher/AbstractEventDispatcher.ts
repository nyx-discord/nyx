import type {
  AnyEventSubscriber,
  EventDispatchArgs,
  EventDispatcher,
  EventSubscriberErrorHandler,
  EventSubscriberMiddleware,
  MiddlewareList,
} from '@nyx-discord/core';
import {
  EventSubscriberMiddlewareError,
  UncaughtEventSubscriberMiddlewareError,
} from '@nyx-discord/core';

export abstract class AbstractEventDispatcher implements EventDispatcher {
  protected readonly errorHandler: EventSubscriberErrorHandler;

  protected readonly middleware: MiddlewareList<EventSubscriberMiddleware>;

  constructor(
    errorHandler: EventSubscriberErrorHandler,
    middleware: MiddlewareList<EventSubscriberMiddleware>,
  ) {
    this.errorHandler = errorHandler;
    this.middleware = middleware;
  }

  public getErrorHandler(): EventSubscriberErrorHandler {
    return this.errorHandler;
  }

  public getMiddleware(): MiddlewareList<EventSubscriberMiddleware> {
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
