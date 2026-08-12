import type {
  AnyEventSubscriber,
  MiddlewareResponse,
  Metadata,
} from '@nyx-discord/types';
import {
  EventSubscriberLifetimeEnum,
  PriorityEnum,
  TypedFields,
} from '@nyx-discord/types';
import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware.js';

export class LifetimeCheckEventMiddleware extends AbstractEventSubscriberMiddleware {
  protected override readonly priority = PriorityEnum.Lowest;

  protected override readonly protected = true;

  public async check(
    subscriber: AnyEventSubscriber,
    meta: Metadata,
  ): Promise<MiddlewareResponse> {
    if (subscriber.getLifetime() === EventSubscriberLifetimeEnum.Once) {
      const bus = TypedFields.EventBus.get(meta, true);
      await bus.unsubscribe(subscriber);
    }

    return this.true();
  }
}
