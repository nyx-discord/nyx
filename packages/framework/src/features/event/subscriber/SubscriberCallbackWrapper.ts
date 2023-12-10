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
import type { EventDispatchMeta } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

import { AbstractEventSubscriber } from './AbstractEventSubscriber.js';

type EventCallback<Arguments extends any[] = any[]> = (
  meta: EventDispatchMeta,
  ...args: Arguments
) => Awaitable<void>;

export class SubscriberCallbackWrapper<
  EventArgsObject extends Record<keyof EventArgsObject & string, unknown[]>,
  Event extends keyof EventArgsObject & string,
> extends AbstractEventSubscriber<EventArgsObject, Event> {
  protected readonly event: Event;

  constructor(
    event: Event,
    eventHandler: EventCallback<EventArgsObject[Event]>,
  ) {
    super();
    this.event = event;
    this.handleEvent = eventHandler;
  }

  public override readonly handleEvent: EventCallback<EventArgsObject[Event]>;
}
