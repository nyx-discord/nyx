import type {
  BotServiceEventArgs,
  BotServiceEvent,
  EventSubscriber,
  Metadata,
} from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

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
