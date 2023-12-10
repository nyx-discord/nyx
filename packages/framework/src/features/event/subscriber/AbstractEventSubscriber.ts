/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Collection } from '@discordjs/collection';
import type {
  EventBus,
  EventDispatchMeta,
  EventSubscriber,
  EventSubscriberFilter,
  EventSubscriberLifetime,
  Identifier,
  MetaCollection,
  Priority,
  ReadonlyMetaCollection,
} from '@nyx-discord/core';
import { EventSubscriberLifetimeEnum, PriorityEnum } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

export abstract class AbstractEventSubscriber<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  Event extends keyof EventArgsObject & string,
> implements EventSubscriber<EventArgsObject, Event>
{
  protected readonly meta: MetaCollection = new Collection();

  protected readonly ignoreHandled: boolean = true;

  protected readonly priority: Priority = PriorityEnum.Normal;

  protected readonly filter: EventSubscriberFilter<
    EventArgsObject,
    Event
  > | null = null;

  protected readonly lifetime: EventSubscriberLifetime =
    EventSubscriberLifetimeEnum.On;

  protected readonly id: Identifier = Symbol(this.constructor.name);

  protected locked = false;

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

  public getFilter(): EventSubscriberFilter<EventArgsObject, Event> | null {
    return this.filter;
  }

  public getId(): Identifier {
    return this.id;
  }

  public getMeta(): ReadonlyMetaCollection {
    return this.meta;
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

  public abstract handleEvent(
    meta: EventDispatchMeta,
    ...args: EventArgsObject[Event]
  ): Awaitable<void>;
}
