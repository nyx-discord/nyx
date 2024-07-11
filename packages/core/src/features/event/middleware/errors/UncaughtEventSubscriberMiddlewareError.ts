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

import { FeatureError } from '../../../../errors/FeatureError.js';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import type { EventDispatchArgs } from '../../dispatch/args/EventDispatchArgs';
import type { AnyEventSubscriber } from '../../subscriber/types/AnyEventSubscriber';
import type { EventSubscriberMiddleware } from '../EventSubscriberMiddleware.js';

export class UncaughtEventSubscriberMiddlewareError extends FeatureError<AnyEventSubscriber> {
  protected readonly middlewareList: MiddlewareList<EventSubscriberMiddleware>;

  protected readonly args: EventDispatchArgs;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<EventSubscriberMiddleware>,
    subscriber: AnyEventSubscriber,
    args: EventDispatchArgs,
  ) {
    super(
      error,
      subscriber,
      'There was an uncaught error while checking a middleware list.',
    );
    this.args = args;
    this.middlewareList = middlewareList;
  }

  /** Returns the arguments that were passed to the event subscriber when the error occurred. */
  public getArgs(): EventDispatchArgs {
    return this.args;
  }

  /** Returns the middleware list that threw this error. */
  public getList(): MiddlewareList<EventSubscriberMiddleware> {
    return this.middlewareList;
  }
}
