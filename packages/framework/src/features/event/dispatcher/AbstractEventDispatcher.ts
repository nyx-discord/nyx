/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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
  EventDispatcher,
  EventSubscriberErrorHandler,
  EventSubscriberMiddleware,
  MiddlewareList,
} from '@nyx-discord/core';
import {
  EventSubscriberMiddlewareError,
  UncaughtEventSubscriberMiddlewareError,
} from '@nyx-discord/core';

export abstract class AbstractEventDispatcher implements EventDispatcher {
  protected readonly errorHandler: EventSubscriberErrorHandler;

  protected readonly middleware: MiddlewareList<EventSubscriberMiddleware>;

  constructor(
    errorHandler: EventSubscriberErrorHandler,
    middleware: MiddlewareList<EventSubscriberMiddleware>,
  ) {
    this.errorHandler = errorHandler;
    this.middleware = middleware;
  }

  public getErrorHandler(): EventSubscriberErrorHandler {
    return this.errorHandler;
  }

  public getMiddleware(): MiddlewareList<EventSubscriberMiddleware> {
    return this.middleware;
  }

  public abstract dispatch(
    subscribers: AnyEventSubscriber[],
    args: Parameters<(typeof subscribers)[number]['handleEvent']>,
  ): Promise<void>;

  protected wrapMiddlewareError(
    error: Error,
    subscriber: AnyEventSubscriber,
    args: EventDispatchArgs,
  ): Error {
    if (error instanceof EventSubscriberMiddlewareError) {
      return error;
    }

    return new UncaughtEventSubscriberMiddlewareError(
      error,
      this.middleware,
      subscriber,
      args,
    );
  }
}
