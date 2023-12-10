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
  LinkedListNode,
  Middleware,
  MiddlewareLinkedList,
} from '@nyx-discord/core';
import { SortedLinkedList } from '@nyx-discord/core';

export abstract class AbstractMiddlewareLinkedList<
    MiddlewareType extends Middleware<any, any> &
      LinkedListNode<MiddlewareType>,
  >
  extends SortedLinkedList<MiddlewareType>
  implements MiddlewareLinkedList<MiddlewareType>
{
  public async check(
    checked: Parameters<MiddlewareType['check']>[0],
    args: Parameters<MiddlewareType['check']>[1],
  ): Promise<boolean> {
    if (this.isEmpty()) return true;

    for (const middleware of this) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await middleware.check(checked, args);
        if (!result.checkNext || !result.allowed) return result.allowed;
      } catch (error) {
        this.throwWrappedError(middleware, checked, args, error as Error);
      }
    }
    return true;
  }

  /**
   * Throws a error instance based on the errored middleware and arguments.
   *
   * By default, it throws the error again (causing an
   * `UncaughtMiddlewareError`). Should be overridden in subclasses to throw
   * feature specific errors.
   */
  protected throwWrappedError(
    _erroredMiddleware: MiddlewareType,
    _checked: Parameters<MiddlewareType['check']>[0],
    _args: Parameters<MiddlewareType['check']>[1],
    error: Error,
  ) {
    throw error;
  }
}
