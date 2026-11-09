import { EventSubscriberMiddlewareError } from '#types/features/event/middleware/errors/EventSubscriberMiddlewareError';
import type { EventSubscriberMiddleware as SubMiddleware } from '#types/features/event/middleware/EventSubscriberMiddleware';
import type { MiddlewareList } from '#types/middleware/list/MiddlewareList';
import type { Tail } from '#types/types/Tail';
import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';
import { LifetimeCheckEventMiddleware } from '../lifetime/LifetimeCheckEventMiddleware';
import { HandleCheckEventMiddleware } from '../meta/HandleCheckEventMiddleware';
import { SubscriberFilterCheckMiddleware } from './SubscriberFilterCheckMiddleware';

export class SubscriberMiddlewareList extends AbstractMiddlewareList<SubMiddleware> {
  public static create(): MiddlewareList<SubMiddleware> {
    const handledEventMiddleware = new HandleCheckEventMiddleware();
    const filterMiddleware = new SubscriberFilterCheckMiddleware();
    const lifetimeEventMiddleware = new LifetimeCheckEventMiddleware();

    return new this().add(
      handledEventMiddleware,
      filterMiddleware,
      lifetimeEventMiddleware,
    );
  }

  /** Wraps a generic error in a {@link EventSubscriberMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: SubMiddleware,
    error: Error,
    subscriber: Parameters<SubMiddleware['check']>[0],
    ...args: Tail<Parameters<SubMiddleware['check']>>
  ): Error {
    return new EventSubscriberMiddlewareError(
      error,
      erroredMiddleware,
      subscriber,
      args,
    );
  }
}
