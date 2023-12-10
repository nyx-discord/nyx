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
  AsyncEventDispatcher,
  EventSubscriberErrorHandler,
  EventSubscriberMiddleware,
  MiddlewareLinkedList,
} from '@nyx-discord/core';

import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { SubscriberMiddlewareLinkedList } from '../middleware/SubscriberMiddlewareLinkedList.js';
import { AbstractEventDispatcher } from './AbstractEventDispatcher.js';

export class BasicAsyncEventDispatcher
  extends AbstractEventDispatcher
  implements AsyncEventDispatcher
{
  protected concurrencyLimit: number | null = 3;

  constructor(
    errorHandler: EventSubscriberErrorHandler,
    middleware: MiddlewareLinkedList<EventSubscriberMiddleware>,
    concurrencyLimit?: number | null,
  ) {
    super(errorHandler, middleware);
    if (concurrencyLimit !== undefined) {
      this.concurrencyLimit = concurrencyLimit;
    }
  }

  public static create(concurrencyLimit?: number | null): AsyncEventDispatcher {
    return new BasicAsyncEventDispatcher(
      new BasicErrorHandler(),
      SubscriberMiddlewareLinkedList.create(),
      concurrencyLimit,
    );
  }

  public async dispatch(
    subscribers: AnyEventSubscriber[],
    args: Parameters<AnyEventSubscriber['handleEvent']>,
  ): Promise<void> {
    const pendingPromises: Promise<void>[] = [];

    for (const subscriber of subscribers) {
      if (
        this.concurrencyLimit
        && pendingPromises.length >= this.concurrencyLimit
      ) {
        /** It's assumed that all promises in pendingPromises have a catch statement, so catching here is not needed. */
        // eslint-disable-next-line no-await-in-loop
        await Promise.race(pendingPromises);
      }

      const [meta, ...unknownArgs] = args;

      const promise = Promise.resolve()
        .then(async () => {
          try {
            await this.checkMiddleware(subscriber, args);
          } catch (middlewareError) {
            throw this.wrapMiddlewareError(
              middlewareError as Error,
              subscriber,
              args,
            );
          }

          await subscriber.handleEvent(meta, ...unknownArgs);
        })
        .catch(async (error) => {
          await this.errorHandler.handle(
            error,
            subscriber,
            args,
            meta.getBot(),
          );
        });

      pendingPromises.push(promise);
      void promise.finally(() => {
        const index = pendingPromises.indexOf(promise);
        if (index !== -1) {
          pendingPromises.splice(index, 1);
        }
      });
    }

    await Promise.allSettled(pendingPromises);
  }

  public setConcurrencyLimit(limit: number | null): this {
    this.concurrencyLimit = limit;
    return this;
  }

  public getConcurrencyLimit(): number | null {
    return this.concurrencyLimit;
  }

  protected async checkMiddleware(
    subscriber: AnyEventSubscriber,
    args: Parameters<AnyEventSubscriber['handleEvent']>,
  ): Promise<boolean> {
    return Promise.resolve()
      .then(() => this.middleware.check(subscriber, args))
      .catch(async (error) => {
        const [meta] = args;

        const wrappedError = this.wrapMiddlewareError(
          error as Error,
          subscriber,
          args,
        );

        await this.errorHandler.handle(
          wrappedError,
          subscriber,
          [meta, ...args],
          meta.getBot(),
        );
        return false;
      });
  }
}
