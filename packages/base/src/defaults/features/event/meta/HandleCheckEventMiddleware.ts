import type { AnyEventSubscriber } from '#types/features/event/subscriber/types/AnyEventSubscriber';
import { TypedFields } from '#types/fields/TypedFields';
import type { Metadata } from '#types/meta/Metadata';
import type { MiddlewareResponse } from '#types/middleware/response/MiddlewareResponse';
import { PriorityEnum } from '#types/priority/Priority';
import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware';

export class HandleCheckEventMiddleware extends AbstractEventSubscriberMiddleware {
  protected override priority = PriorityEnum.Highest;

  protected override protected = true;

  public check(
    checked: AnyEventSubscriber,
    meta: Metadata,
  ): MiddlewareResponse {
    if (TypedFields.EventHandled.get(meta) && checked.ignoresHandledEvents()) {
      return this.false();
    }

    return this.true();
  }
}
