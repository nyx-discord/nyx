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
import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver';

import type { Session } from '../session/Session.js';

/** An object for temporal storage of {@link Session} instances. */
export interface SessionRepository extends BotLifecycleObserver {
  /** Returns a session by its ID. */
  get(id: string): Awaitable<Session<unknown> | null | undefined>;

  /** Returns the remaining TTL of the given session. */
  getTTL(id: string): Awaitable<number | null>;

  /**
   * Sets a new TTL for the given item.
   *
   * That is, making the item expire on passed ttl + now.
   */
  setTTL(id: string, ttl: number): Awaitable<void>;

  /** Saves a session. */
  save(session: Session<unknown>): Awaitable<void>;

  /** Deletes a session by its ID. */
  delete(id: string): Awaitable<unknown>;

  /** Checks whether a session is present. */
  has(id: string): boolean;

  /** Sets a callback that will be called when a session expires. */
  setExpirationCallback(
    callback: (value: Session<unknown>) => Awaitable<void>,
  ): void;
}
