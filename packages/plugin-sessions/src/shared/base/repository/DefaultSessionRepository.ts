import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import TTLCache from '@isaacs/ttlcache';
import type {
  Awaitable,
  Constructor,
  InteractionTypes,
} from '@nyx-discord/base';
import type { SessionRepository } from '../../types/repository/SessionRepository.js';
import type { Session } from '../../types/session/Session.js';

type SessionExpirationCallback<
  Types extends InteractionTypes = InteractionTypes,
> = (
  value: Session<unknown, Types>,
  key: string,
  reason: TTLCache.DisposeReason,
) => Awaitable<void>;

export class DefaultSessionRepository<
  Types extends InteractionTypes = InteractionTypes,
>
  extends TTLCache<string, Session<unknown, Types>>
  implements SessionRepository<Types>
{
  private readonly byConstructor = new Map<
    Constructor<Session<unknown, Types>>,
    Collection<string, Session<unknown, Types>>
  >();

  private expirationCallback?: SessionExpirationCallback<Types>;

  constructor(onExpire?: SessionExpirationCallback<Types>) {
    super({
      updateAgeOnGet: false,
      dispose: (
        value: Session<unknown, Types>,
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

  public static create<Types extends InteractionTypes = InteractionTypes>(
    onExpire?: SessionExpirationCallback<Types>,
  ): SessionRepository<Types> {
    return new this(onExpire);
  }

  public onStart(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public onStop(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public save(value: Session<unknown, Types>): void {
    this.set(value.getId(), value, { ttl: value.getTTL() });
    this.indexByConstructor(value);
  }

  public setExpirationCallback(
    callback: SessionExpirationCallback<Types>,
  ): void {
    this.expirationCallback = callback;
  }

  public getTTL(id: string): Awaitable<number | null> {
    return this.getRemainingTTL(id) + Date.now();
  }

  public getSessions(): ReadonlyCollection<string, Session<unknown, Types>> {
    return new Collection(this.entries());
  }

  public getByConstructor(
    constructor: Constructor<Session<unknown, Types>>,
  ): ReadonlyCollection<string, Session<unknown, Types>> {
    return (
      this.byConstructor.get(constructor)
      ?? new Collection<string, Session<unknown, Types>>()
    );
  }

  public next(): IteratorResult<[string, Session<unknown, Types>]> {
    return this.entries().next();
  }

  public override [Symbol.iterator](): IterableIterator<
    [string, Session<unknown, Types>]
  > {
    return this.entries();
  }

  /** Returns the session's constructor and every parent constructor, so subclasses are found by their parents. */
  protected getConstructorChain(
    session: Session<unknown, Types>,
  ): Constructor<Session<unknown, Types>>[] {
    const chain: Constructor<Session<unknown, Types>>[] = [];
    let proto: object | null = Object.getPrototypeOf(session);

    while (proto && proto !== Object.prototype) {
      chain.push(proto.constructor as Constructor<Session<unknown, Types>>);
      proto = Object.getPrototypeOf(proto);
    }

    return chain;
  }

  private indexByConstructor(session: Session<unknown, Types>): void {
    for (const ctor of this.getConstructorChain(session)) {
      if (!this.byConstructor.has(ctor)) {
        this.byConstructor.set(ctor, new Collection());
      }
      this.byConstructor.get(ctor)!.set(session.getId(), session);
    }
  }

  private deindexByConstructor(session: Session<unknown, Types>): void {
    for (const ctor of this.getConstructorChain(session)) {
      const collection = this.byConstructor.get(ctor);
      if (!collection) continue;

      collection.delete(session.getId());
      if (collection.size === 0) {
        this.byConstructor.delete(ctor);
      }
    }
  }
}
