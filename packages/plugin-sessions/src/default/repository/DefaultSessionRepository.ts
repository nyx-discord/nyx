import TTLCache from '@isaacs/ttlcache';
import type { Constructor } from '@nyx-discord/framework';
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
  private readonly byConstructor = new Map<
    Constructor<Session<unknown>>,
    Collection<string, Session<unknown>>
  >();

  private expirationCallback?: SessionExpirationCallback;

  constructor(onExpire?: SessionExpirationCallback) {
    super({
      updateAgeOnGet: false,
      dispose: (
        value: Session<unknown>,
        key: string,
        reason: TTLCache.DisposeReason,
      ) => {
        if (!value) return;

        this.deindexByConstructor(value);

        if (this.expirationCallback && reason === 'stale') {
          void this.expirationCallback(value, key, reason);
        }
      },
    });

    this.expirationCallback = onExpire;
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
    this.set(value.getId(), value, { ttl: value.getTTL() });
    this.indexByConstructor(value);
  }

  public setExpirationCallback(callback: SessionExpirationCallback): void {
    this.expirationCallback = callback;
  }

  public getTTL(id: string): Awaitable<number | null> {
    return this.getRemainingTTL(id) + Date.now();
  }

  public getSessions(): ReadonlyCollection<string, Session<unknown>> {
    return new Collection(this.entries());
  }

  public getByConstructor(
    constructor: Constructor<Session<unknown>>,
  ): ReadonlyCollection<string, Session<unknown>> {
    return (
      this.byConstructor.get(constructor)
      ?? new Collection<string, Session<unknown>>()
    );
  }

  public next(): IteratorResult<[string, Session<unknown>]> {
    return this.entries().next();
  }

  public override [Symbol.iterator](): IterableIterator<
    [string, Session<unknown>]
  > {
    return this.entries();
  }

  private indexByConstructor(session: Session<unknown>): void {
    const ctor = session.constructor as Constructor<Session<unknown>>;
    if (!this.byConstructor.has(ctor)) {
      this.byConstructor.set(ctor, new Collection());
    }
    this.byConstructor.get(ctor)!.set(session.getId(), session);
  }

  private deindexByConstructor(session: Session<unknown>): void {
    const ctor = session.constructor as Constructor<Session<unknown>>;
    const collection = this.byConstructor.get(ctor);
    if (!collection) return;

    collection.delete(session.getId());
    if (collection.size === 0) {
      this.byConstructor.delete(ctor);
    }
  }
}
