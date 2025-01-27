import { FeatureError } from '../../../../errors/FeatureError.js';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import type { EventDispatchArgs } from '../../dispatch/args/EventDispatchArgs';
import type { AnyEventSubscriber } from '../../subscriber/types/AnyEventSubscriber';
import type { EventSubscriberMiddleware } from '../EventSubscriberMiddleware.js';

export class UncaughtEventSubscriberMiddlewareError extends FeatureError<AnyEventSubscriber> {
  protected readonly middlewareList: MiddlewareList<EventSubscriberMiddleware>;

  protected readonly args: EventDispatchArgs;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<EventSubscriberMiddleware>,
    subscriber: AnyEventSubscriber,
    args: EventDispatchArgs,
  ) {
    super(
      error,
      subscriber,
      'There was an uncaught error while checking a middleware list.',
    );
    this.args = args;
    this.middlewareList = middlewareList;
  }

  /** Returns the arguments that were passed to the event subscriber when the error occurred. */
  public getArgs(): EventDispatchArgs {
    return this.args;
  }

  /** Returns the middleware list that threw this error. */
  public getList(): MiddlewareList<EventSubscriberMiddleware> {
    return this.middlewareList;
  }
}
