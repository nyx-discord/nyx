import type {
  EventSubscriber,
  Metadata,
  ScheduleEventArgs,
  ScheduleEvent,
} from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

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
