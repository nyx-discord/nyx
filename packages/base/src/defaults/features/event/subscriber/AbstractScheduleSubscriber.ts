import type { EventSubscriber } from '#types/features/event/subscriber/EventSubscriber';
import type {
  ScheduleEvent,
  ScheduleEventArgs,
} from '#types/features/schedule/events/ScheduleEvent';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractEventSubscriber } from './AbstractEventSubscriber';

/** Utility to make a subscriber for the {@link ScheduleManager#getEventBus ScheduleManager event bus}. */
export abstract class AbstractScheduleSubscriber<Event extends ScheduleEvent>
  extends AbstractEventSubscriber<ScheduleEventArgs, Event>
  implements EventSubscriber<ScheduleEventArgs, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: ScheduleEventArgs[Event]
  ): Awaitable<void>;
}
