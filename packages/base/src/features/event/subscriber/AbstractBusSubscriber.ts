import type {
  EventBusEvent,
  EventBusEventArgs,
  EventSubscriber,
  Metadata,
} from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

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
