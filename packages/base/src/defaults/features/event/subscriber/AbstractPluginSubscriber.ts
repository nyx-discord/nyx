import type { EventSubscriber } from '#types/features/event/subscriber/EventSubscriber';
import type {
  PluginEvent,
  PluginEventArgs,
} from '#types/features/plugin/events/PluginEvent';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractEventSubscriber } from './AbstractEventSubscriber';

/** Utility to make a subscriber for the {@link PluginManager#getEventBus PluginManager event bus}. */
export abstract class AbstractPluginSubscriber<Event extends PluginEvent>
  extends AbstractEventSubscriber<PluginEventArgs, Event>
  implements EventSubscriber<PluginEventArgs, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: PluginEventArgs[Event]
  ): Awaitable<void>;
}
