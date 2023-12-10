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

import type { EventSubscriberMiddleware } from '../EventSubscriberMiddleware.js';
import { FeatureError } from '../../../../errors/FeatureError.js';
import type { AnyEventSubscriber } from '../../subscriber/types/AnyEventSubscriber';

export class EventSubscriberMiddlewareError extends FeatureError<AnyEventSubscriber> {
  protected readonly middleware: EventSubscriberMiddleware;

  protected readonly args: unknown[];

  constructor(
    error: Error,
    middleware: EventSubscriberMiddleware,
    subscriber: AnyEventSubscriber,
    args: unknown[],
  ) {
    super(error, subscriber, 'There was an error while checking a middleware.');
    this.args = args;
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): EventSubscriberMiddleware {
    return this.middleware;
  }
}
