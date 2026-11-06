import type { Filterable } from '#types/filter/Filterable';
import type { Identifiable } from '#types/identity/Identifiable';
import type { Metadata } from '#types/meta/Metadata';
import type { Metadatable } from '#types/meta/Metadatable';
import type { PriorityAware } from '#types/priority/PriorityAware';
import type { Protectable } from '#types/protect/Protectable';
import type { Awaitable } from '#types/types/Awaitable';
import type { EventBus } from '../bus/EventBus.js';
import type { EventSubscriberLifetime } from '../lifetime/EventSubscriberLifetime.js';
import type { EventSubscriberFilterResolvable } from './filter/EventSubscriberFilterResolvable';

/** An object that can subscribe to a event on an {@link EventBus}. */
export interface EventSubscriber<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
  Event extends keyof ArgsRecord & string = keyof ArgsRecord & string,
>
  extends
    Identifiable,
    Protectable,
    Filterable<EventSubscriberFilterResolvable<ArgsRecord, Event>>,
    Metadatable,
    PriorityAware {
  /** Handles an event given the passed args and metadata. */
  handleEvent(meta: Metadata, ...args: ArgsRecord[Event]): Awaitable<void>;

  /** Notifies the subscriber that it's been subscribed to a given event bus. */
  onSubscribe(bus: EventBus<ArgsRecord>): Awaitable<void>;

  /** Notifies the subscriber that it's been unsubscribed from a given event bus. */
  onUnsubscribe(bus: EventBus<ArgsRecord>): Awaitable<void>;

  /** Notifies the subscriber that an event bus where it's subscribed has been unregistered. */
  onBusUnregister(bus: EventBus<ArgsRecord>): Awaitable<void>;

  /** Returns whether this subscriber should be notified on events marked as handled by another subscriber. */
  ignoresHandledEvents(): boolean;

  /** Returns whether this subscriber is protected. A protected subscriber can only be unsubscribed via {@link EventBus#unsubscribeProtected}. */
  isProtected(): boolean;

  /** Returns the event this subscriber handles. */
  getEvent(): Event;

  /** Returns the lifetime of this subscriber. */
  getLifetime(): EventSubscriberLifetime;
}
