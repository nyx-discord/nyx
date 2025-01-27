import type { EventDispatchMeta } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

type EventCallback<Arguments extends any[] = any[]> = (
  meta: EventDispatchMeta,
  ...args: Arguments
) => Awaitable<void>;

export class SubscriberCallbackWrapper<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  Event extends keyof EventArgsObject & string,
> extends AbstractEventSubscriber<EventArgsObject, Event> {
  protected readonly event: Event;

  constructor(
    event: Event,
    eventHandler: EventCallback<EventArgsObject[Event]>,
  ) {
    super();
    this.event = event;
    this.handleEvent = eventHandler;
  }

  public override readonly handleEvent: EventCallback<EventArgsObject[Event]>;
}
