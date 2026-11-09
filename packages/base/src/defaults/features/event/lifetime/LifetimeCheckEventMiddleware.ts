import { EventSubscriberLifetimeEnum } from '#types/features/event/lifetime/EventSubscriberLifetime';
import type { AnyEventSubscriber } from '#types/features/event/subscriber/types/AnyEventSubscriber';
import { TypedFields } from '#types/fields/TypedFields';
import type { Metadata } from '#types/meta/Metadata';
import type { MiddlewareResponse } from '#types/middleware/response/MiddlewareResponse';
import { PriorityEnum } from '#types/priority/Priority';
import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware';

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
