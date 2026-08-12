import type {
  AnyEventSubscriber,
  Metadata,
  MiddlewareResponse,
} from '@nyx-discord/types';
import { PriorityEnum, TypedFields } from '@nyx-discord/types';
import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware.js';

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
