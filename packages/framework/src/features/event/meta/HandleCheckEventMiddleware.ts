import type {
  AnyEventSubscriber,
  EventDispatchMeta,
  MiddlewareResponse,
} from '@nyx-discord/core';
import { PriorityEnum } from '@nyx-discord/core';

import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware.js';

export class HandleCheckEventMiddleware extends AbstractEventSubscriberMiddleware {
  protected override priority = PriorityEnum.Highest;

  protected override locked = true;

  public check(
    checked: AnyEventSubscriber,
    meta: EventDispatchMeta,
  ): MiddlewareResponse {
    if (meta.isHandled() && checked.ignoresHandledEvents()) {
      return this.false();
    }
    return this.true();
  }
}
