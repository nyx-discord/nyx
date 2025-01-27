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
