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
  EventSubscriberErrorHandler,
  EventSubscriberMiddleware,
  MiddlewareLinkedList,
  SyncEventDispatcher,
} from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { AbstractEventDispatcher } from './AbstractEventDispatcher.js';
import { SubscriberMiddlewareLinkedList } from '../middleware/SubscriberMiddlewareLinkedList.js';

export class BasicSyncEventDispatcher
  extends AbstractEventDispatcher
  implements SyncEventDispatcher
{
  protected syncTimeout: number | null = 10_000; // 10 seconds

  constructor(
    errorHandler: EventSubscriberErrorHandler,
    middleware: MiddlewareLinkedList<EventSubscriberMiddleware>,
    syncTimeout?: number | null,
  ) {
    super(errorHandler, middleware);
    if (syncTimeout !== undefined) {
      this.syncTimeout = syncTimeout;
    }
  }

  public static create(syncTimeout?: number | null): SyncEventDispatcher {
    return new BasicSyncEventDispatcher(
      BasicErrorHandler.create(),
      SubscriberMiddlewareLinkedList.create(),
      syncTimeout,
    );
  }

  public async dispatch(
    subscribers: AnyEventSubscriber[],
    args: EventDispatchArgs,
  ): Promise<void> {
    const timeout = this.syncTimeout;
    const callFunction: (subscriber: AnyEventSubscriber) => Promise<void> =
      timeout === null
        ? async (subscriber) => await subscriber.handleEvent(...args)
        : async (subscriber) =>
            await this.executeWithTimeout(
              () => subscriber.handleEvent(...args),
              timeout,
            );

    const [meta] = args;
    for (const subscriber of subscribers) {
      try {
        const middlewareSuccess = await this.middleware.check(subscriber, args);
        if (!middlewareSuccess) {
          continue;
        }
      } catch (error) {
        const wrappedError = this.wrapMiddlewareError(
          error as Error,
          subscriber,
          args,
        );

        await this.errorHandler.handle(
          wrappedError,
          subscriber,
          args,
          meta.getBot(),
        );
      }

      try {
        await callFunction(subscriber);
      } catch (error) {
        await this.errorHandler.handle(
          error as Error,
          subscriber,
          args,
          meta.getBot(),
        );
      }
    }
  }

  public setSyncTimeout(timeout: number | null): this {
    this.syncTimeout = timeout !== null ? (timeout < 0 ? 0 : timeout) : null;
    return this;
  }

  public getSyncTimeout(): number | null {
    return this.syncTimeout;
  }

  /** Resolves once either the given function concluded executing or the given timeout has passed. */
  protected async executeWithTimeout(
    fn: () => Awaitable<void>,
    timeout: number,
  ): Promise<void> {
    if (timeout === 0) {
      return fn();
    }

    const timedPromise = new Promise<void>(function (resolve) {
      setTimeout(resolve, timeout);
    });

    return Promise.race([fn(), timedPromise]);
  }
}
