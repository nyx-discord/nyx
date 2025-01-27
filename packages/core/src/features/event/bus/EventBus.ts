import type { Comparator, ReadonlyCollection } from '@discordjs/collection';
import type { Awaitable } from 'discord.js';

import type { NyxBot } from '../../../bot/NyxBot';
import type { Identifiable } from '../../../identity/Identifiable.js';
import type { Identifier } from '../../../identity/Identifier.js';
import type { Lockable } from '../../../lock/Lockable.js';
import type { MetaCollection } from '../../../meta/MetaCollection.js';
import type { Metadatable } from '../../../meta/Metadatable';
import type { ReadonlyCollectionFrom } from '../../../types/ReadonlyCollectionFrom.js';
import type { EventDispatcher } from '../dispatch/dispatcher/EventDispatcher.js';
import type { EventSubscriberCollection } from '../subscriber/collection/EventSubscriberCollection.js';
import type { EventSubscriber } from '../subscriber/EventSubscriber';
import type { AnyEventSubscriberFrom } from '../subscriber/types/AnyEventSubscriberFrom';

/** An object that holds methods for subscribing to and emitting events, and getting information about the subscribers and subscribed events. */
export interface EventBus<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
> extends Lockable,
    Identifiable,
    Metadatable,
    IterableIterator<[Identifier, AnyEventSubscriberFrom<ArgsRecord>]> {
  /** Returns the saved bot for this bus, if any. */
  getBot(): NyxBot | null;

  /** Called by the {@link EventManager} after this bus is registered on it. */
  onRegister(): Awaitable<void>;

  /** Called by the {@link EventManager} after this bus is unregistered from it. */
  onUnregister(): Awaitable<void>;

  /**
   * Subscribes a list of {@link EventSubscriber}.
   *
   * @throws {IllegalDuplicateError} If a subscriber with that ID is already
   *   subscribed to the event.
   */
  subscribe<
    const Sub extends EventSubscriber<ArgsRecord, keyof ArgsRecord & string>,
    const EventName extends ReturnType<Sub['getEvent']> & keyof ArgsRecord,
  >(
    ...subscribers: EventSubscriber<ArgsRecord, EventName>[]
  ): Awaitable<this>;

  /**
   * Unsubscribes an unlocked {@link EventSubscriber}.
   *
   * @throws {ObjectNotFoundError}  If the subscriber is not found.
   * @throws {LockedObjectError}    If the subscriber is locked.
   */
  unsubscribe(subscriber: AnyEventSubscriberFrom<ArgsRecord>): Awaitable<this>;

  /**
   * Unsubscribes a locked {@link EventSubscriber}.
   *
   * @throws {ObjectNotFoundError}  If the subscriber is not found.
   */
  unsubscribeLocked(
    subscriber: AnyEventSubscriberFrom<ArgsRecord>,
  ): Awaitable<this>;

  /** Emits an event with the given name and arguments. */
  emit<const EventName extends keyof ArgsRecord & string>(
    eventName: EventName,
    args: ArgsRecord[EventName],
    meta?: MetaCollection,
  ): Awaitable<this>;

  /** Removes all subscribers from the given event, or from all events if an eventName is not provided. */
  clearSubscribers(eventName?: string, clearLocked?: boolean): Awaitable<this>;

  /** Returns whether the given subscriber is subscribed to the bus. */
  isSubscribed(subscriber: AnyEventSubscriberFrom<ArgsRecord>): boolean;

  /** Sets the order in which subscribers are executed. */
  sortSubscribers(
    comparator: Comparator<Identifier, AnyEventSubscriberFrom<ArgsRecord>>,
  ): this;

  /** Sets the dispatcher for this bus' subscribers. */
  setDispatcher(dispatcher: EventDispatcher): this;

  /** Returns the dispatcher for this bus' subscribers. */
  getDispatcher(): EventDispatcher;

  /** Returns a readonly collection of all subscribers and their identifiers. */
  getSubscribers(): ReadonlyCollection<
    Identifier,
    AnyEventSubscriberFrom<ArgsRecord>
  >;

  /** Returns a {@link EventSubscriberCollection} of all subscribed events. */
  getSubscribedEvents(): ReadonlyCollectionFrom<
    EventSubscriberCollection<ArgsRecord>
  >;

  /** Returns an iterator of all {@link EventSubscriber}s. */
  values(): IterableIterator<AnyEventSubscriberFrom<ArgsRecord>>;

  /** Returns an iterator of all {@link Identifier}s. */
  keys(): IterableIterator<Identifier>;

  /** Returns an iterator of all [{@link Identifier}, {@link EventSubscriber}] pairs. */
  entries(): IterableIterator<[Identifier, AnyEventSubscriberFrom<ArgsRecord>]>;
}
