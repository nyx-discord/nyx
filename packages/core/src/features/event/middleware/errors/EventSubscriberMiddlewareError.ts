import { FeatureError } from '../../../../errors/FeatureError.js';
import type { AnyEventSubscriber } from '../../subscriber/types/AnyEventSubscriber';
import type { EventSubscriberMiddleware } from '../EventSubscriberMiddleware.js';

export class EventSubscriberMiddlewareError extends FeatureError<AnyEventSubscriber> {
  protected readonly middleware: EventSubscriberMiddleware;

  protected readonly args: unknown[];

  constructor(
    error: Error,
    middleware: EventSubscriberMiddleware,
    subscriber: AnyEventSubscriber,
    args: unknown[],
  ) {
    super(error, subscriber, 'There was an error while checking a middleware.');
    this.args = args;
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): EventSubscriberMiddleware {
    return this.middleware;
  }
}
