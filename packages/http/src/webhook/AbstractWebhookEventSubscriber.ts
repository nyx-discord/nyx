import type { ApplicationWebhookEventType } from '@discordjs/core';
import type { Awaitable, Metadata } from '@nyx-discord/djs-core';
import { BaseClientSubscriber } from '@nyx-discord/djs-core';
import type { HttpClientEvents } from '../client/HttpClientEvents.js';

/** Utility to make a subscriber for a webhook event, on an event bus over the {@link HttpNyxClient} emitter. */
export abstract class AbstractWebhookEventSubscriber<
  Event extends ApplicationWebhookEventType & keyof HttpClientEvents,
> extends BaseClientSubscriber<HttpClientEvents, Event> {
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: HttpClientEvents[Event]
  ): Awaitable<void>;
}
