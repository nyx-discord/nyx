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

import type { Awaitable } from 'discord.js';

import type { LinkedListNode } from '../../list/LinkedListNode.js';
import type { SortedLinkedList } from '../../list/SortedLinkedList.js';
import type { Middleware } from '../Middleware.js';

/** A {@link LinkedList} object made to contain {@link Middleware Middlewares} and manage their check logic. */
export interface MiddlewareLinkedList<
  MiddlewareType extends Middleware<any, any> & LinkedListNode<MiddlewareType>,
> extends SortedLinkedList<MiddlewareType> {
  /** Checks all the stored {@link Middleware Middlewares} using the passed arguments and returns the result. */
  check(
    checked: Parameters<MiddlewareType['check']>[0],
    args: Parameters<MiddlewareType['check']>[1],
  ): Awaitable<boolean>;
}
