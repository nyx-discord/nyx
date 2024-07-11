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

import type { Awaitable } from 'discord.js';

import type { AnyClass } from '../../types/AnyClass.js';
import type { ReadonlyCollectionFrom } from '../../types/ReadonlyCollectionFrom.js';
import type { ErrorConsumer } from '../consumer/ErrorConsumer.js';
import type { ErrorConsumerCollection } from '../consumer/ErrorConsumerCollection.js';

/** An object for handling errors caused by an object inside a bot. */
export interface ErrorHandler<
  ErroredObject extends object,
  Args extends unknown[],
> {
  /** Sets an error consumer for a specific error type. */
  setConsumer<const ErrorType extends AnyClass>(
    error: ErrorType,
    consumer: ErrorConsumer<InstanceType<ErrorType>, ErroredObject, Args>,
  ): void;

  /** Removes the error consumer for the specified error type. */
  removeConsumerOf(error: AnyClass): void;

  /** Returns whether the handler has an error consumer for the given error. */
  hasConsumer(error: AnyClass): boolean;

  /** Returns a collection of all registered error consumers. */
  getConsumers(): ReadonlyCollectionFrom<
    ErrorConsumerCollection<ErroredObject, Args>
  >;

  /** Removes all error consumers. */
  clear(): void;

  /** Returns the fallback error consumer. */
  getFallbackConsumer(): ErrorConsumer<object, ErroredObject, Args>;

  /** Sets a fallback error consumer that will handle any errors not explicitly handled by other consumers. */
  setFallbackConsumer(
    consumer: ErrorConsumer<object, ErroredObject, Args>,
  ): void;

  /** Handles the specified error by calling the appropriate error consumer, if one is registered. */
  handle(
    error: object,
    erroredObject: ErroredObject,
    args: Args,
  ): Awaitable<void>;
}
