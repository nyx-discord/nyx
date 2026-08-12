import type { Awaitable } from '../../../types/Awaitable.js';
import type { ReadonlyCollection } from '@discordjs/collection';
import type { Identifier } from '../../../identity/Identifier.js';
import type { Metadata } from '../../../meta/Metadata';
import type { Metadatable } from '../../../meta/Metadatable';
import type { MetadataFactory } from '../../../meta/MetadataFactory';
import type { Comparator } from '../../../types/Comparator';
import type { ReadonlyCollectionFrom } from '../../../types/ReadonlyCollectionFrom.js';
import type { EventDispatcher } from '../dispatch/dispatcher/EventDispatcher.js';
import type { EventSubscriberCollection } from '../subscriber/collection/EventSubscriberCollection.js';
import type { EventSubscriber } from '../subscriber/EventSubscriber';
import type { AnyEventSubscriberFrom } from '../subscriber/types/AnyEventSubscriberFrom';

/** An object that holds methods for subscribing to and emitting events, and getting information about the subscribers and subscribed events. */
export interface EventBus<
  ArgsRecord extends Record<keyof ArgsRecord & string, unknown[]>,
>
  extends
    Metadatable,
    IterableIterator<[Identifier, AnyEventSubscriberFrom<ArgsRecord>]> {
  /**
   * Subscribes a list of {@link EventSubscriber}.
   *
   * @throws {IllegalDuplicateError} If a subscriber with that ID is already
   *   subscribed to the event.
   */
  subscribe(
    ...subscribers: AnyEventSubscriberFrom<ArgsRecord>[]
  ): Awaitable<this>;

  /**
   * Unsubscribes an unprotected {@link EventSubscriber}.
   *
   * @throws {ObjectNotFoundError}     If the subscriber is not found.
   * @throws {ProtectedObjectError}    If the subscriber is protected.
   */
  unsubscribe(subscriber: AnyEventSubscriberFrom<ArgsRecord>): Awaitable<this>;

  /**
   * Unsubscribes a protected {@link EventSubscriber}.
   *
   * @throws {ObjectNotFoundError}  If the subscriber is not found.
   */
  unsubscribeProtected(
    subscriber: AnyEventSubscriberFrom<ArgsRecord>,
  ): Awaitable<this>;

  /** Emits an event with the given name and arguments. */
  emit<const EventName extends keyof ArgsRecord & string>(
    eventName: EventName,
    args: ArgsRecord[EventName],
    meta?: Metadata,
  ): Awaitable<this>;

  /** Removes all subscribers from the given event, or from all events if an eventName is not provided. */
  clearSubscribers(
    eventName?: string,
    clearProtected?: boolean,
  ): Awaitable<this>;

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

  /** Returns the {@link MetadataFactory} for creating or populating {@link Metadata}s for event emits. */
  getMetadataFactory(): MetadataFactory;

  /** Returns an iterator of all {@link EventSubscriber}s. */
  values(): IterableIterator<AnyEventSubscriberFrom<ArgsRecord>>;

  /** Returns an iterator of all {@link Identifier}s. */
  keys(): IterableIterator<Identifier>;

  /** Returns an iterator of all [{@link Identifier}, {@link EventSubscriber}] pairs. */
  entries(): IterableIterator<[Identifier, AnyEventSubscriberFrom<ArgsRecord>]>;
}
