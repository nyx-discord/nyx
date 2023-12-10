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

import type { Comparator } from '@discordjs/collection';
import type {
  AnyEventSubscriberFrom,
  EventBusEventArgs,
  EventDispatcher,
  EventEmitterBus,
  EventEmitterLike,
  Identifier,
  NyxBot,
} from '@nyx-discord/core';
import { EventEmitter } from 'events';

import { BasicEventBus } from './BasicEventBus.js';
import { BasicSyncEventDispatcher } from '../dispatcher/BasicSyncEventDispatcher.js';
import { BasicAsyncEventDispatcher } from '../dispatcher/BasicAsyncEventDispatcher.js';

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
    bot: NyxBot,
    id: Identifier,
    emitter: Emitter,
    sorter: Comparator<Identifier, AnyEventSubscriberFrom<EventArgsObject>>,
    dispatcher: EventDispatcher,
  ) {
    super(bot, id, sorter, dispatcher);
    this.emitter = emitter;
  }

  public static createSyncWithEmitter<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
    Emitter extends EventEmitter,
  >(bot: NyxBot, id: Identifier, emitter: Emitter) {
    return new BasicEventEmitterBus<EventArgsObject, Emitter>(
      bot,
      id,
      emitter,
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicSyncEventDispatcher.create(),
    );
  }

  public static createAsyncWithEmitter<
    EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
    Emitter extends EventEmitter,
  >(bot: NyxBot, id: Identifier, emitter: Emitter) {
    const newEmitter = emitter ?? (new EventEmitter() as Emitter);

    return new BasicEventEmitterBus<EventArgsObject, Emitter>(
      bot,
      id,
      newEmitter,
      (firstValue, secondValue) =>
        firstValue.getPriority() - secondValue.getPriority(),
      BasicAsyncEventDispatcher.create(),
    );
  }

  public override async subscribe(
    subscriber: AnyEventSubscriberFrom<EventArgsObject>,
  ): Promise<this> {
    await super.subscribe(subscriber);

    const event = subscriber.getEvent();
    this.listenToEmitter(
      event as (keyof EventArgsObject | keyof EventBusEventArgs) & string,
    );
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
    clearLocked = false,
  ): Promise<this> {
    await super.clearSubscribers(eventName, clearLocked);
    for (const event of this.listenedEvents) {
      this.unlistenFromEmitter(event);
    }
    return this;
  }

  public getEmitter(): Emitter {
    return this.emitter;
  }

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
