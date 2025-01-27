import type {
  AnyEventSubscriber,
  EventDispatchMeta,
  MiddlewareResponse,
} from '@nyx-discord/core';
import { EventSubscriberLifetimeEnum, PriorityEnum } from '@nyx-discord/core';

import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware.js';

export class LifetimeCheckEventMiddleware extends AbstractEventSubscriberMiddleware {
  protected override readonly priority = PriorityEnum.Lowest;

  protected override readonly locked = true;

  public async check(
    subscriber: AnyEventSubscriber,
    meta: EventDispatchMeta,
  ): Promise<MiddlewareResponse> {
    if (subscriber.getLifetime() === EventSubscriberLifetimeEnum.Once) {
      const bus = meta.getBus();

      await bus.unsubscribe(subscriber);
    }

    return this.true();
  }
}
