import { BaseClientSubscriber } from '@nyx-discord/base';
import type { Awaitable, Metadata } from '@nyx-discord/types';
import type { ClientEvents } from 'discord.js';

/** Utility to make a subscriber for the {@link NyxBot#getClientEventBus client event bus}. */
export abstract class AbstractDJSClientSubscriber<
  Event extends keyof ClientEvents,
> extends BaseClientSubscriber<ClientEvents, Event> {
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: ClientEvents[Event]
  ): Awaitable<void>;
}
