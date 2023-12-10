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

import type {
  AnyEventSubscriber,
  EventDispatchArgs,
  MiddlewareResponse,
} from '@nyx-discord/core';
import { EventSubscriberLifetimeEnum, PriorityEnum } from '@nyx-discord/core';

import { AbstractEventSubscriberMiddleware } from '../middleware/AbstractEventSubscriberMiddleware.js';

export class LifetimeCheckEventMiddleware extends AbstractEventSubscriberMiddleware {
  protected override readonly priority = PriorityEnum.Lowest;

  protected override readonly locked = true;

  public async check(
    subscriber: AnyEventSubscriber,
    args: EventDispatchArgs,
  ): Promise<MiddlewareResponse> {
    if (subscriber.getLifetime() === EventSubscriberLifetimeEnum.Once) {
      const [meta] = args;
      const bus = meta.getBus();

      await bus.unsubscribe(subscriber);
    }

    return this.true();
  }
}
