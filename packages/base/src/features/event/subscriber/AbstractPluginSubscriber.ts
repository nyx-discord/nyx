import type {
  EventSubscriber,
  Metadata,
  PluginEventArgs,
  PluginEvent,
} from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

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
