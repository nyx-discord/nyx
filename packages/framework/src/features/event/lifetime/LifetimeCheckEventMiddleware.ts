import type {
  AnyEventSubscriber,
  MiddlewareResponse,
  MetaCollection,
} from '@nyx-discord/core';
import {
  EventSubscriberLifetimeEnum,
  PriorityEnum,
  TypedFields,
} from '@nyx-discord/core';
import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware.js';

export class LifetimeCheckEventMiddleware extends AbstractEventSubscriberMiddleware {
  protected override readonly priority = PriorityEnum.Lowest;

  protected override readonly protected = true;

  public async check(
    subscriber: AnyEventSubscriber,
    meta: MetaCollection,
  ): Promise<MiddlewareResponse> {
    if (subscriber.getLifetime() === EventSubscriberLifetimeEnum.Once) {
      const bus = TypedFields.EventBus.get(meta, true);
      await bus.unsubscribe(subscriber);
    }

    return this.true();
  }
}
