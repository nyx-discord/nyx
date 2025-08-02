import type { Comparator, ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import type {
  AnyEventBus,
  AnyEventSubscriberFrom,
  EventBus,
  EventBusEventArgs,
  EventDispatchArgs,
  EventDispatcher,
  EventSubscriberCollection,
  Identifier,
  MetaCollection,
  ReadonlyCollectionFrom,
} from '@nyx-discord/core';
import {
  EventBusEventEnum,
  IllegalDuplicateError,
  IllegalStateError,
  MetaCollectionFactory,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';
import { DefaultMetaCollectionFactory } from '../../../meta/DefaultMetaCollectionFactory.js';
import { BasicAsyncEventDispatcher } from '../dispatcher/BasicAsyncEventDispatcher.js';
import { BasicSyncEventDispatcher } from '../dispatcher/BasicSyncEventDispatcher.js';

export class BasicEventBus<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
> implements EventBus<EventArgsObject>
{
  protected readonly id: Identifier;

  protected readonly subscribers: EventSubscriberCollection<EventArgsObject> =
    new Collection() as EventSubscriberCollection<EventArgsObject>;

  protected dispatcher: EventDispatcher;

  protected locked: boolean = false;

  protected sorter: Comparator<
    Identifier,
    AnyEventSubscriberFrom<EventArgsObject>
  >;

  protected readonly meta: MetaCollection = new Collection();

  protected readonly metaFactory: MetaCollectionFactory;

  constructor(
    id: Identifier,
    sorter: Comparator<Identifier, AnyEventSubscriberFrom<EventArgsObject>>,
    dispatcher: EventDispatcher,
    metaFactory: MetaCollectionFactory,
  ) {
    this.id = id;
    this.dispatcher = dispatcher;
    this.sorter = sorter;
    this.metaFactory = metaFactory;
  }

  public static createSync<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  >(id: Identifier) {
    return new BasicEventBus<EventArgsObject>(
      id,
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicSyncEventDispatcher.create(),
      new DefaultMetaCollectionFactory(),
    );
  }

  public static createAsync<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  >(
    id: Identifier,
    metaFactory?: MetaCollectionFactory,
  ): EventBus<EventArgsObject> {
    return new BasicEventBus<EventArgsObject>(
      id,
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicAsyncEventDispatcher.create(),
      metaFactory ?? new DefaultMetaCollectionFactory(),
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

  public async unsubscribeLocked(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
  ): Promise<this> {
    await this.performUnsubscribe(subscriber, true);
    return this;
  }

  public async clearSubscribers(
    eventName?: string,
    clearLocked = false,
  ): Promise<this> {
    const affected = eventName
      ? this.subscribers.filter((_, event) => event === eventName)
      : this.subscribers;

    if (!affected || !affected.size) return this;

    const subscriberPromises: Array<Awaitable<void>> = [];

    for (const [key, collection] of affected.entries()) {
      const affectedObjects = clearLocked
        ? collection
        : collection.filter((_, k) => !collection.get(k)?.isLocked());

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
    meta?: MetaCollection,
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

  public getId(): Identifier {
    return this.id;
  }

  public getMeta(): MetaCollection {
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

  public getMetaCollectionFactory(): MetaCollectionFactory {
    return this.metaFactory;
  }

  public onUnregister(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public onRegister(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public isLocked(): boolean {
    return this.locked;
  }

  public lock(): this {
    this.locked = true;

    return this;
  }

  public unlock(): this {
    this.locked = false;

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
    meta?: MetaCollection,
  ): EventDispatchArgs<Args> {
    const metadata = this.createMetaCollection(meta, eventName);
    return [metadata, ...eventArgs];
  }

  protected async performUnsubscribe(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
    unsubscribeLocked: boolean,
  ): Promise<void> {
    const eventName = subscriber.getEvent();
    const id = subscriber.getId();

    const presentSubscriber = this.subscribers.get(eventName)?.get(id);
    if (!presentSubscriber) {
      throw new ObjectNotFoundError();
    }

    if (!unsubscribeLocked && presentSubscriber.isLocked()) {
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
  protected createMetaCollection(
    meta: MetaCollection | undefined,
    event: string,
  ): MetaCollection {
    const id = Symbol(`Event:${event} @${Date.now()}`);
    return this.metaFactory.createOrPopulate(meta, id);
  }
}
