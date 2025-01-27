import type {
  MiddlewareList,
  EventSubscriberMiddleware as SubMiddleware,
  Tail,
} from '@nyx-discord/core';
import { EventSubscriberMiddlewareError } from '@nyx-discord/core';
import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';

import { LifetimeCheckEventMiddleware } from '../lifetime/LifetimeCheckEventMiddleware.js';
import { HandleCheckEventMiddleware } from '../meta/HandleCheckEventMiddleware.js';
import { SubscriberFilterCheckMiddleware } from './SubscriberFilterCheckMiddleware.js';

export class SubscriberMiddlewareList extends AbstractMiddlewareList<SubMiddleware> {
  public static create(): MiddlewareList<SubMiddleware> {
    const handledEventMiddleware = new HandleCheckEventMiddleware();
    const filterMiddleware = new SubscriberFilterCheckMiddleware();
    const lifetimeEventMiddleware = new LifetimeCheckEventMiddleware();

    return new SubscriberMiddlewareList().bulkAdd(
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
