import type { EventDispatchArgs } from '#types/features/event/dispatch/args/EventDispatchArgs';
import type { EventSubscriberMiddleware } from '#types/features/event/middleware/EventSubscriberMiddleware';
import type { AnyEventSubscriber } from '#types/features/event/subscriber/types/AnyEventSubscriber';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware';

export abstract class AbstractEventSubscriberMiddleware
  extends AbstractMiddleware<AnyEventSubscriber, EventDispatchArgs>
  implements EventSubscriberMiddleware {}
