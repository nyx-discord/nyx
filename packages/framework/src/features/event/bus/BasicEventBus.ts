import type {
  AnyEventBus,
  AnyEventSubscriberFrom,
  Comparator,
  EventBus,
  EventBusEventArgs,
  EventDispatchArgs,
  EventDispatcher,
  EventSubscriberCollection,
  Identifier,
  Metadata,
  MetadataFactory,
  ReadonlyCollectionFrom,
} from '@nyx-discord/core';
import {
  EventBusEventEnum,
  IllegalDuplicateError,
  IllegalStateError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { Awaitable, ReadonlyCollection } from 'discord.js';
import { Collection } from 'discord.js';
import { DefaultMetadataFactory } from '../../../meta/DefaultMetadataFactory';
import { BasicAsyncEventDispatcher } from '../dispatcher/BasicAsyncEventDispatcher.js';
import { BasicSyncEventDispatcher } from '../dispatcher/BasicSyncEventDispatcher.js';

export class BasicEventBus<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
> implements EventBus<EventArgsObject> {
  protected readonly subscribers: EventSubscriberCollection<EventArgsObject> =
    new Collection() as EventSubscriberCollection<EventArgsObject>;

  protected dispatcher: EventDispatcher;

  protected protected: boolean = false;

  protected sorter: Comparator<
    Identifier,
    AnyEventSubscriberFrom<EventArgsObject>
  >;

  protected readonly meta: Metadata = Object.create(null);

  protected readonly metaFactory: MetadataFactory;

  constructor(
    sorter: Comparator<Identifier, AnyEventSubscriberFrom<EventArgsObject>>,
    dispatcher: EventDispatcher,
    metaFactory: MetadataFactory,
  ) {
    this.dispatcher = dispatcher;
    this.sorter = sorter;
    this.metaFactory = metaFactory;
  }

  public static createSync<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  >(metaFactory?: MetadataFactory): EventBus<EventArgsObject> {
    return new this<EventArgsObject>(
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicSyncEventDispatcher.create(),
      metaFactory ?? new DefaultMetadataFactory(),
    );
  }

  public static createAsync<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  >(metaFactory?: MetadataFactory): EventBus<EventArgsObject> {
    return new this<EventArgsObject>(
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicAsyncEventDispatcher.create(),
      metaFactory ?? new DefaultMetadataFactory(),
    );
  }

  public async subscribe(
    ...subscribers: AnyEventSubscriberFrom<EventArgsObject>[]
  ): Promise<this> {
    for (const subscriber of subscribers) {
      const eventName = subscriber.getEvent();
      const id = subscriber.getId();

      const existingSubscribers = this.subscribers.get(eventName);
      const presentSubscriber = existingSubscribers?.get(id);
      if (presentSubscriber) {
        throw new IllegalDuplicateError(
          presentSubscriber,
          subscriber,
          'Subscriber with the same ID already exists',
        );
      }

      const newSubscribers = existingSubscribers
        ? existingSubscribers.set(id, subscriber)
        : new Collection<Identifier, AnyEventSubscriberFrom<EventArgsObject>>([
            [id, subscriber],
          ]);

      const newSortedSubscribers = newSubscribers.sort(this.sorter);
      this.subscribers.set(eventName, newSortedSubscribers);

      await this.emitBusEvent(EventBusEventEnum.EventSubscriberAdd, [
        subscriber,
      ]);
    }

    return this;
  }

  public async unsubscribe(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
  ): Promise<this> {
    await this.performUnsubscribe(subscriber, false);
    return this;
  }

  public async unsubscribeProtected(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
  ): Promise<this> {
    await this.performUnsubscribe(subscriber, true);
    return this;
  }

  public async clearSubscribers(
    eventName?: string,
    clearProtected = false,
  ): Promise<this> {
    const affected = eventName
      ? this.subscribers.filter((_, event) => event === eventName)
      : this.subscribers;

    if (!affected || !affected.size) return this;

    const subscriberPromises: Array<Awaitable<void>> = [];

    for (const [key, collection] of affected.entries()) {
      const affectedObjects = clearProtected
        ? collection
        : collection.filter((_, k) => !collection.get(k)?.isProtected());

      if (!affectedObjects || !affectedObjects.size) continue;

      for (const [subscriberId, subscriber] of affectedObjects.entries()) {
        const unsubscribePromise = subscriber.onUnsubscribe(
          this as EventBus<EventArgsObject>,
        );
        subscriberPromises.push(unsubscribePromise);
        collection.delete(subscriberId);
      }

      if (!collection.size) this.subscribers.delete(key);
    }

    await Promise.allSettled(subscriberPromises);
    return this;
  }

  public isSubscribed(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
  ): boolean {
    return (
      this.subscribers.get(subscriber.getEvent())?.has(subscriber.getId())
      ?? false
    );
  }

  public async emit<const EventName extends keyof EventArgsObject & string>(
    eventName: EventName,
    args: EventArgsObject[EventName],
    meta?: Metadata,
  ): Promise<this> {
    const subscriberMap = this.subscribers.get(eventName);
    if (!subscriberMap) return this;

    const subscribers = Array.from(subscriberMap.values());
    if (!subscribers.length) return this;

    const callArgs = this.generateArgsForEvent(eventName, args, meta);
    await this.dispatcher.dispatch(subscribers, callArgs);
    return this;
  }

  public sortSubscribers(
    sorter: Comparator<Identifier, AnyEventSubscriberFrom<EventArgsObject>>,
  ): this {
    this.sorter = sorter;
    for (const subMap of this.subscribers.values()) {
      subMap.sort(sorter);
    }
    return this;
  }

  public getSubscribedEvents(): ReadonlyCollectionFrom<
    EventSubscriberCollection<EventArgsObject>
  > {
    return this.subscribers;
  }

  public getMeta(): Metadata {
    return this.meta;
  }

  public setDispatcher(dispatcher: EventDispatcher): this {
    this.dispatcher = dispatcher;
    return this;
  }

  public getDispatcher(): EventDispatcher {
    return this.dispatcher;
  }

  public getSubscribers(): ReadonlyCollection<
    Identifier,
    AnyEventSubscriberFrom<EventArgsObject>
  > {
    return this.subscribers.reduce(
      (accumulator, value) => accumulator.concat(value),
      new Collection<Identifier, AnyEventSubscriberFrom<EventArgsObject>>(),
    );
  }

  public getMetadataFactory(): MetadataFactory {
    return this.metaFactory;
  }

  public isProtected(): boolean {
    return this.protected;
  }

  public protect(): this {
    this.protected = true;

    return this;
  }

  public unprotect(): this {
    this.protected = false;

    return this;
  }

  public *values(): IterableIterator<AnyEventSubscriberFrom<EventArgsObject>> {
    yield* this.getSubscribers().values();
  }

  public *keys(): IterableIterator<Identifier> {
    yield* this.getSubscribers().keys();
  }

  public *entries(): IterableIterator<
    [Identifier, AnyEventSubscriberFrom<EventArgsObject>]
  > {
    yield* this.getSubscribers().entries();
  }

  public next(): IteratorResult<
    [Identifier, AnyEventSubscriberFrom<EventArgsObject>]
  > {
    return this.entries().next();
  }

  public [Symbol.iterator](): IterableIterator<
    [Identifier, AnyEventSubscriberFrom<EventArgsObject>]
  > {
    return this.entries();
  }

  /** Generates the args for a given event. */
  protected generateArgsForEvent<Args extends unknown[]>(
    eventName: string,
    eventArgs: Args,
    meta?: Metadata,
  ): EventDispatchArgs<Args> {
    const metadata = this.createMetadata(meta, eventName);
    return [metadata, ...eventArgs];
  }

  protected async performUnsubscribe(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
    unsubscribeProtected: boolean,
  ): Promise<void> {
    const eventName = subscriber.getEvent();
    const id = subscriber.getId();

    const presentSubscriber = this.subscribers.get(eventName)?.get(id);
    if (!presentSubscriber) {
      throw new ObjectNotFoundError();
    }

    if (!unsubscribeProtected && presentSubscriber.isProtected()) {
      throw new IllegalStateError();
    }

    const subMap = this.subscribers.get(eventName) as Collection<
      Identifier,
      AnyEventSubscriberFrom<EventArgsObject>
    >;
    subMap.delete(id);

    if (subMap.size === 0) {
      this.subscribers.delete(eventName);
    }

    await this.emitBusEvent(EventBusEventEnum.EventSubscriberRemove, [
      subscriber,
    ]);

    await subscriber.onUnsubscribe(this as AnyEventBus);
  }

  /**
   * Bus related events can't be emitted from {@link emit},
   * so this method is needed for those events.
   */
  protected emitBusEvent<
    const EventName extends keyof EventBusEventArgs & string,
  >(eventName: EventName, args: EventBusEventArgs[EventName]): Promise<this> {
    return this.emit(
      eventName as unknown as keyof EventArgsObject & string,
      args as unknown as EventArgsObject[keyof EventArgsObject & string],
    );
  }

  /** Creates a meta collection for an event dispatch. */
  protected createMetadata(
    meta: Metadata | undefined,
    event: string,
  ): Metadata {
    const id = Symbol(`Event:${event} @${Date.now()}`);
    return this.metaFactory.createOrPopulate(meta, id);
  }
}
