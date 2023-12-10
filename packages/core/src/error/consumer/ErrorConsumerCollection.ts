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

import type { Collection } from '@discordjs/collection';
import type { AnyClass } from '../../types/AnyClass.js';
import type { Constructor } from '../../types/Constructor.js';
import type { ErrorConsumer } from './ErrorConsumer.js';

/**
 * Type of Collection that contains {@link ErrorConsumer}, keyed by the constructors
 * of the Errors they consume.
 *
 * Same as `Collection<Constructor, ErrorConsumer<AnyClass, ErroredObject, Args>>` except it overrides
 * the get method's return type to specify that getting a class returns a consumer for that
 * specific class.
 */
export type ErrorConsumerCollection<
  ErroredObject,
  Args extends unknown[],
> = Collection<Constructor, ErrorConsumer<AnyClass, ErroredObject, Args>> & {
  get<const ErrorType extends AnyClass>(
    key: ErrorType,
  ): ErrorConsumer<ErrorType, ErroredObject, Args> | undefined;
};
