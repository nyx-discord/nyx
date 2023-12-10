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
  EventSubscriberMiddleware as SubMiddleware,
  MiddlewareLinkedList,
} from '@nyx-discord/core';
import { EventSubscriberMiddlewareError } from '@nyx-discord/core';

import { LifetimeCheckEventMiddleware } from '../lifetime/LifetimeCheckEventMiddleware.js';
import { HandleCheckEventMiddleware } from '../meta/HandleCheckEventMiddleware.js';
import { AbstractMiddlewareLinkedList } from '../../../filter/middleware/AbstractMiddlewareLinkedList.js';
import { SubscriberFilterCheckMiddleware } from './SubscriberFilterCheckMiddleware.js';

export class SubscriberMiddlewareLinkedList extends AbstractMiddlewareLinkedList<SubMiddleware> {
  public static create(): MiddlewareLinkedList<SubMiddleware> {
    const handledEventMiddleware = new HandleCheckEventMiddleware();
    const filterMiddleware = new SubscriberFilterCheckMiddleware();
    const lifetimeEventMiddleware = new LifetimeCheckEventMiddleware();

    return new SubscriberMiddlewareLinkedList().addAll([
      handledEventMiddleware,
      filterMiddleware,
      lifetimeEventMiddleware,
    ]);
  }

  protected override throwWrappedError(
    erroredMiddleware: SubMiddleware,
    subscriber: Parameters<SubMiddleware['check']>[0],
    args: Parameters<SubMiddleware['check']>[1],
    error: Error,
  ) {
    throw new EventSubscriberMiddlewareError(
      error,
      erroredMiddleware,
      subscriber,
      args,
    );
  }
}
