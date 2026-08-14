import type {
  AnyEventSubscriberFrom,
  Comparator,
  EventBusEventArgs,
  EventDispatcher,
  EventEmitterBus,
  EventEmitterLike,
  Identifier,
  MetadataFactory,
} from '@nyx-discord/types';
import { EventEmitter } from 'events';
import { DefaultMetadataFactory } from '../../../meta/DefaultMetadataFactory';
import { BasicAsyncEventDispatcher } from '../dispatcher/BasicAsyncEventDispatcher.js';
import { BasicSyncEventDispatcher } from '../dispatcher/BasicSyncEventDispatcher.js';
import { BasicEventBus } from './BasicEventBus.js';

export class BasicEventEmitterBus<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  Emitter extends EventEmitterLike,
>
  extends BasicEventBus<EventArgsObject>
  implements EventEmitterBus<EventArgsObject>
{
  protected readonly listenedEvents: Set<string> = new Set();

  protected readonly emitter: Emitter;

  constructor(
    emitter: Emitter,
    sorter: Comparator<Identifier, AnyEventSubscriberFrom<EventArgsObject>>,
    dispatcher: EventDispatcher,
    metaFactory: MetadataFactory,
  ) {
    super(sorter, dispatcher, metaFactory);
    this.emitter = emitter;
  }

  public static createSyncWithEmitter<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
    Emitter extends EventEmitterLike,
  >(emitter: Emitter, metaFactory?: MetadataFactory) {
    return new BasicEventEmitterBus<EventArgsObject, Emitter>(
      emitter,
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicSyncEventDispatcher.create(),
      metaFactory ?? new DefaultMetadataFactory(),
    );
  }

  public static createAsyncWithEmitter<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
    Emitter extends EventEmitterLike,
  >(emitter: Emitter, metaFactory?: MetadataFactory) {
    const newEmitter = (emitter ?? new EventEmitter()) as Emitter;

    return new BasicEventEmitterBus<EventArgsObject, Emitter>(
      newEmitter,
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicAsyncEventDispatcher.create(),
      metaFactory ?? new DefaultMetadataFactory(),
    );
  }

  public override async subscribe(
    ...subscribers: AnyEventSubscriberFrom<EventArgsObject>[]
  ): Promise<this> {
    for (const subscriber of subscribers) {
      await super.subscribe(subscriber);

      const event = subscriber.getEvent();
      this.listenToEmitter(
        event as (keyof EventArgsObject | keyof EventBusEventArgs) & string,
      );
    }
    return this;
  }

  public override async unsubscribe(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
  ): Promise<this> {
    await super.unsubscribe(subscriber);
    this.unlistenFromEmitter(subscriber.getEvent());
    return this;
  }

  public override async clearSubscribers(
    eventName?: string,
    clearProtected = false,
  ): Promise<this> {
    await super.clearSubscribers(eventName, clearProtected);
    for (const event of this.listenedEvents) {
      this.unlistenFromEmitter(event);
    }
    return this;
  }

  public getEmitter(): Emitter {
    return this.emitter;
  }

  /** Listens a specific event in the emitter. */
  protected listenToEmitter(event: string): this {
    if (this.listenedEvents.has(event)) return this;

    this.emitter.on(event, (...args: unknown[]) =>
      this.emit(
        event as keyof EventArgsObject & string,
        args as EventArgsObject[keyof EventArgsObject & string],
      ),
    );

    this.listenedEvents.add(event);
    return this;
  }

  /** Unlistents a specific event in the emitter. */
  protected unlistenFromEmitter(event: string): this {
    const currentSubscribers = this.subscribers.get(event);

    if (
      !this.listenedEvents.has(event)
      || !currentSubscribers
      || !currentSubscribers.size
    ) {
      return this;
    }

    this.emitter.removeAllListeners(event);
    this.listenedEvents.delete(event);
    return this;
  }
}
