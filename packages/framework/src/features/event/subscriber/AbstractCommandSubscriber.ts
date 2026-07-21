import type {
  CommandEventArgs,
  CommandEvent,
  EventSubscriber,
  Metadata,
} from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

/** Utility to make a subscriber for the {@link CommandManager#getEventBus CommandManager event bus}. */
export abstract class AbstractCommandSubscriber<Event extends CommandEvent>
  extends AbstractEventSubscriber<CommandEventArgs, Event>
  implements EventSubscriber<CommandEventArgs, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: CommandEventArgs[Event]
  ): Awaitable<void>;
}
