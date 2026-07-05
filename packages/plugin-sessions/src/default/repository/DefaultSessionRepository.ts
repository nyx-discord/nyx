import TTLCache from '@isaacs/ttlcache';
import type { Awaitable, ReadonlyCollection } from 'discord.js';
import { Collection } from 'discord.js';
import type { SessionRepository } from '../../core/repository/SessionRepository';
import type { Session } from '../../core/session/Session';

type SessionExpirationCallback = (
  value: Session<unknown>,
  key: string,
  reason: TTLCache.DisposeReason,
) => Awaitable<void>;

export class DefaultSessionRepository
  extends TTLCache<string, Session<unknown>>
  implements SessionRepository
{
  constructor(onExpire?: SessionExpirationCallback) {
    const options: TTLCache.Options<string, Session<unknown>> = {
      updateAgeOnGet: false,
    };
    if (onExpire) {
      options.dispose = onExpire;
    }

    super(options);
  }

  public static create(
    onExpire?: SessionExpirationCallback,
  ): SessionRepository {
    return new this(onExpire);
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

  public override [Symbol.iterator](): IterableIterator<
    [string, Session<unknown>]
  > {
    return this.entries();
  }

  protected dispose: SessionExpirationCallback = () => {};
}
