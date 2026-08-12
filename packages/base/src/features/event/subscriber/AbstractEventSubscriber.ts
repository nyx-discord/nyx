import type {
  EventBus,
  EventSubscriber,
  EventSubscriberFilterResolvable,
  EventSubscriberLifetime,
  Identifier,
  Metadata,
  Priority,
  ReadonlyMetadata,
} from '@nyx-discord/types';
import {
  EventSubscriberLifetimeEnum,
  PriorityEnum,
  TypedFields,
} from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';

export abstract class AbstractEventSubscriber<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  Event extends keyof EventArgsObject & string,
> implements EventSubscriber<EventArgsObject, Event> {
  protected readonly meta: Metadata = Object.create(null);

  protected readonly ignoreHandled: boolean = true;

  protected readonly priority: Priority = PriorityEnum.Normal;

  protected readonly filter: EventSubscriberFilterResolvable<
    EventArgsObject,
    Event
  > | null = null;

  protected readonly lifetime: EventSubscriberLifetime =
    EventSubscriberLifetimeEnum.On;

  protected readonly id: Identifier = Symbol(this.constructor.name);

  protected protected = false;

  protected abstract readonly event: Event;

  public onSubscribe(_bus: EventBus<EventArgsObject>): Awaitable<void> {
    /** Do nothing by default */
  }

  public onUnsubscribe(_bus: EventBus<EventArgsObject>): Awaitable<void> {
    /** Do nothing by default */
  }

  public onBusUnregister(_bus: EventBus<EventArgsObject>): Awaitable<void> {
    /** Do nothing by default */
  }

  public getEvent(): Event {
    return this.event;
  }

  public getLifetime(): EventSubscriberLifetime {
    return this.lifetime;
  }

  public ignoresHandledEvents(): boolean {
    return this.ignoreHandled;
  }

  public getPriority(): Priority {
    return this.priority;
  }

  public getFilter(): EventSubscriberFilterResolvable<
    EventArgsObject,
    Event
  > | null {
    return this.filter;
  }

  public getId(): Identifier {
    return this.id;
  }

  public getMeta(): ReadonlyMetadata {
    return this.meta;
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

  public abstract handleEvent(
    meta: Metadata,
    ...args: EventArgsObject[Event]
  ): Awaitable<void>;

  protected isHandled(meta: Metadata): boolean {
    return TypedFields.EventHandled.get(meta) === true;
  }

  protected setHandled(meta: Metadata, handled = true): void {
    TypedFields.EventHandled.set(meta, handled);
  }
}
