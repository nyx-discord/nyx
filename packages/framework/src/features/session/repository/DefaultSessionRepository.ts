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

import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import TTLCache from '@isaacs/ttlcache';
import type { Session, SessionRepository } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

type SessionExpirationCallback = (
  value: Session<unknown>,
  key: string,
  reason: TTLCache.DisposeReason,
) => Awaitable<void>;

export class DefaultSessionRepository extends TTLCache<
  string,
  Session<unknown>
> {
  constructor(onExpire?: SessionExpirationCallback) {
    super({
      updateAgeOnGet: false,
      dispose: onExpire,
    });
  }

  public static create(
    onExpire?: SessionExpirationCallback,
  ): SessionRepository {
    return new DefaultSessionRepository(onExpire);
  }

  public onSetup(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public onStart(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public onStop(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public save(value: Session<unknown>): void {
    this.set(value.getId(), value, {
      ttl: value.getTTL(),
    });
  }

  public setExpirationCallback(callback: SessionExpirationCallback): void {
    this.dispose = (
      value: Session<unknown>,
      key: string,
      reason: TTLCache.DisposeReason,
    ) => {
      if (!value || reason !== 'stale') {
        return;
      }

      void callback(value, key, reason);
    };
  }

  public getTTL(id: string): Awaitable<number | null> {
    return this.getRemainingTTL(id) + Date.now();
  }

  public getSessions(): ReadonlyCollection<string, Session<unknown>> {
    return new Collection(this.entries());
  }

  public next(): IteratorResult<[string, Session<unknown>]> {
    return this.entries().next();
  }

  public [Symbol.iterator](): IterableIterator<[string, Session<unknown>]> {
    return this.entries();
  }

  protected dispose: SessionExpirationCallback = () => {};
}
