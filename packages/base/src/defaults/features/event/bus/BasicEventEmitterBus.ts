import type { EventEmitterBus } from '#types/features/event/bus/EventEmitterBus';
import type { EventDispatcher } from '#types/features/event/dispatch/dispatcher/EventDispatcher';
import type { EventEmitterLike } from '#types/features/event/emitter/EventEmitterLike';
import type { EventBusEventArgs } from '#types/features/event/events/EventBusEvent';
import type { AnyEventSubscriberFrom } from '#types/features/event/subscriber/types/AnyEventSubscriberFrom';
import type { Identifier } from '#types/identity/Identifier';
import type { MetadataFactory } from '#types/meta/MetadataFactory';
import type { Comparator } from '#types/types/Comparator';
import { DefaultMetadataFactory } from '../../../meta/DefaultMetadataFactory';
import { BasicAsyncEventDispatcher } from '../dispatcher/BasicAsyncEventDispatcher';
import { BasicSyncEventDispatcher } from '../dispatcher/BasicSyncEventDispatcher';
import { BasicEventBus } from './BasicEventBus';

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
    return new BasicEventEmitterBus<EventArgsObject, Emitter>(
      emitter,
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
    if (this.subscribers.has(event)) return this;

    this.emitter.removeAllListeners(event);
    this.listenedEvents.delete(event);
    return this;
  }
}
