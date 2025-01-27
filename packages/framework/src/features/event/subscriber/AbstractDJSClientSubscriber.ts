import type { EventDispatchMeta, EventSubscriber } from '@nyx-discord/core';
import type { Awaitable, ClientEvents } from 'discord.js';

import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

export abstract class AbstractDJSClientSubscriber<
    Event extends keyof ClientEvents,
  >
  extends AbstractEventSubscriber<ClientEvents, Event>
  implements EventSubscriber<ClientEvents, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: EventDispatchMeta,
    ...args: ClientEvents[Event]
  ): Awaitable<void>;
}
