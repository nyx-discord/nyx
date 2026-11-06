import type { Metadata } from '#types/meta/Metadata';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractEventSubscriber } from './AbstractEventSubscriber';

type EventCallback<Arguments extends unknown[] = unknown[]> = (
  meta: Metadata,
  ...args: Arguments
) => Awaitable<void>;

export class SubscriberCallbackWrapper<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  Event extends keyof EventArgsObject & string,
> extends AbstractEventSubscriber<EventArgsObject, Event> {
  public override readonly handleEvent: EventCallback<EventArgsObject[Event]>;
  protected readonly event: Event;

  constructor(
    event: Event,
    eventHandler: EventCallback<EventArgsObject[Event]>,
  ) {
    super();
    this.event = event;
    this.handleEvent = eventHandler;
  }
}
