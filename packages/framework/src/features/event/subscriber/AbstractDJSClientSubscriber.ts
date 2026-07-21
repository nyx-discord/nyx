import type { EventSubscriber, Metadata } from '@nyx-discord/core';
import type { Awaitable, ClientEvents } from 'discord.js';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

/** Utility to make a subscriber for the {@link NyxBot#getClientEventBus client event bus}. */
export abstract class AbstractDJSClientSubscriber<
  Event extends keyof ClientEvents,
>
  extends AbstractEventSubscriber<ClientEvents, Event>
  implements EventSubscriber<ClientEvents, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: ClientEvents[Event]
  ): Awaitable<void>;
}
