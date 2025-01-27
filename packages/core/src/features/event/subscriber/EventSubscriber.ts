import type { Awaitable } from 'discord.js';
import type { Filterable } from '../../../filter/Filterable.js';
import type { Identifiable } from '../../../identity/Identifiable.js';
import type { Lockable } from '../../../lock/Lockable.js';
import type { Metadatable } from '../../../meta/Metadatable.js';
import type { Priority } from '../../../priority/Priority.js';
import type { EventBus } from '../bus/EventBus.js';
import type { EventDispatchMeta } from '../dispatch/meta/EventDispatchMeta.js';
import type { EventSubscriberLifetime } from '../lifetime/EventSubscriberLifetime.js';
import type { EventSubscriberFilter } from './filter/EventSubscriberFilter.js';

/** An object that can subscribe to a event on an {@link EventBus}. */
export interface EventSubscriber<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
  Event extends keyof ArgsRecord & string,
> extends Identifiable,
    Lockable,
    Filterable<EventSubscriberFilter<ArgsRecord, Event>>,
    Metadatable {
  /** Handles an event given the passed args and metadata. */
  handleEvent(
    meta: EventDispatchMeta,
    ...args: ArgsRecord[Event]
  ): Awaitable<void>;

  /** Notifies the subscriber that it's been subscribed to a given event bus. */
  onSubscribe(bus: EventBus<ArgsRecord>): Awaitable<void>;

  /** Notifies the subscriber that it's been unsubscribed from a given event bus. */
  onUnsubscribe(bus: EventBus<ArgsRecord>): Awaitable<void>;

  /** Notifies the subscriber that an event bus where it's subscribed has been unregistered. */
  onBusUnregister(bus: EventBus<ArgsRecord>): Awaitable<void>;

  /** Returns whether this subscriber should be notified on events marked as handled by another subscriber. */
  ignoresHandledEvents(): boolean;

  /** Returns whether this subscriber is locked. A locked subscriber can only be unsubscribed via {@link EventBus#unsubscribeLocked}. */
  isLocked(): boolean;

  /** Returns the event this subscriber handles. */
  getEvent(): Event;

  /** Returns the lifetime of this subscriber. */
  getLifetime(): EventSubscriberLifetime;

  /** Returns the priority of this subscriber. The ones with higher priority will be executed first. */
  getPriority(): Priority;
}
