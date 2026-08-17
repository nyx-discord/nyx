import type { MappedEvents } from '@discordjs/core';
import { BaseClientSubscriber } from '@nyx-discord/base';
import type { Awaitable, Metadata } from '@nyx-discord/types';

/** Utility to make a subscriber for the {@link NyxBot#getClientEventBus client event bus}. */
export abstract class AbstractCoreClientSubscriber<
  Event extends keyof MappedEvents,
> extends BaseClientSubscriber<MappedEvents, Event> {
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: MappedEvents[Event]
  ): Awaitable<void>;
}
