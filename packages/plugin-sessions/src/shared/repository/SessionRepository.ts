import type {
  Awaitable,
  BotLifecycleObserver,
  Constructor,
  InteractionTypes,
} from '@nyx-discord/types';
import type { ReadonlyCollection } from '@discordjs/collection';
import type { Session } from '../session/Session.js';

/** An object for temporal storage of {@link Session} instances. */
export interface SessionRepository<
  Types extends InteractionTypes = InteractionTypes,
>
  extends
    BotLifecycleObserver,
    IterableIterator<[string, Session<unknown, Types>]> {
  /** Returns a session by its ID. */
  get(id: string): Awaitable<Session<unknown, Types> | null | undefined>;

  /** Returns the remaining TTL of the given session. */
  getTTL(id: string): Awaitable<number | null>;

  /**
   * Sets a new TTL for the given item.
   *
   * That is, making the item expire on passed ttl + now.
   */
  setTTL(id: string, ttl: number): Awaitable<void>;

  /** Saves a session. */
  save(session: Session<unknown, Types>): Awaitable<void>;

  /** Deletes a session by its ID. */
  delete(id: string): Awaitable<unknown>;

  /** Checks whether a session is present. */
  has(id: string): boolean;

  /** Sets a callback that will be called when a session expires. */
  setExpirationCallback(
    callback: (value: Session<unknown, Types>) => Awaitable<void>,
  ): void;

  /** Returns all registered sessions. */
  getSessions(): ReadonlyCollection<string, Session<unknown, Types>>;

  /**
   * Returns all active sessions whose constructor matches the given one.
   *
   * This includes sessions of subclasses. Useful for querying sessions
   * of a specific type without iterating the entire repository.
   */
  getByConstructor(
    constructor: Constructor<Session<unknown, Types>>,
  ): ReadonlyCollection<string, Session<unknown, Types>>;

  /** Returns an iterator of all {@link Session}s. */
  values(): IterableIterator<Session<unknown, Types>>;

  /** Returns an iterator of all session IDs. */
  keys(): IterableIterator<string>;

  /** Returns an iterator of all [ID, {@link Session}] pairs. */
  entries(): IterableIterator<[string, Session<unknown, Types>]>;
}
