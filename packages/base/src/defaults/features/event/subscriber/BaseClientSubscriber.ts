import type { EventSubscriber } from '#types/features/event/subscriber/EventSubscriber';
import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractEventSubscriber } from './AbstractEventSubscriber';

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
