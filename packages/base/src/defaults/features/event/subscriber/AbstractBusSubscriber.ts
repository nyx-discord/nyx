import type {
  EventBusEvent,
  EventBusEventArgs,
} from '#types/features/event/events/EventBusEvent';
import type { EventSubscriber } from '#types/features/event/subscriber/EventSubscriber';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractEventSubscriber } from './AbstractEventSubscriber';

/** Utility to make a subscriber for an {@link EventBus}'s generic events. */
export abstract class AbstractBusSubscriber
  extends AbstractEventSubscriber<EventBusEventArgs, EventBusEvent>
  implements EventSubscriber<EventBusEventArgs, EventBusEvent>
{
  protected abstract override readonly event: EventBusEvent;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: EventBusEventArgs[EventBusEvent]
  ): Awaitable<void>;
}
