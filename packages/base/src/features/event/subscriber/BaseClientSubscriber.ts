import type { Awaitable, EventSubscriber, Metadata } from '@nyx-discord/types';
import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

/** Utility to make a subscriber for the client event bus. */
export abstract class BaseClientSubscriber<
  ClientEventMap extends Record<keyof ClientEventMap & string, unknown[]> =
    Record<string, unknown[]>,
  Event extends keyof ClientEventMap & string = keyof ClientEventMap & string,
>
  extends AbstractEventSubscriber<ClientEventMap, Event>
  implements EventSubscriber<ClientEventMap, Event>
{
  protected abstract override readonly event: Event;

  public abstract override handleEvent(
    meta: Metadata,
    ...args: ClientEventMap[Event]
  ): Awaitable<void>;
}
