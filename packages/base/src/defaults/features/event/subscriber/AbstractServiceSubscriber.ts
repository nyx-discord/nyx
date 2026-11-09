import type { EventSubscriber } from '#types/features/event/subscriber/EventSubscriber';
import type { Metadata } from '#types/meta/Metadata';
import type {
  BotServiceEvent,
  BotServiceEventArgs,
} from '#types/service/events/BotServiceEvent';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractEventSubscriber } from './AbstractEventSubscriber';

/** Utility to make a subscriber for the {@link BotService#getEventBus BotService event bus}. */
export abstract class AbstractServiceSubscriber<Event extends BotServiceEvent>
  extends AbstractEventSubscriber<BotServiceEventArgs, Event>
  implements EventSubscriber<BotServiceEventArgs, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: BotServiceEventArgs[Event]
  ): Awaitable<void>;
}
