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

import type { EventDispatcher } from './EventDispatcher.js';

export interface SyncEventDispatcher extends EventDispatcher {
  /**
   * Sets the maximum sync execution time of a subscriber.
   *
   * If this time is reached and the subscriber's execution still hasn't
   * finished, the subscriber's execution is moved to parallel and the next
   * subscriber is called.
   *
   * Useful for avoiding long sync subscribers blocking the event loop.
   * Setting it to `null` turns off this behavior.
   */
  setSyncTimeout(timeout: number | null): this;

  /**
   * Sets the maximum sync execution time of a subscriber.
   *
   * See {@link SyncEventDispatcher#setSyncTimeout}.
   */
  getSyncTimeout(): number | null;
}
