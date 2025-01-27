import type { ReadonlyCollection } from '@discordjs/collection';
import type { Awaitable } from 'discord.js';
import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver';

import type { Session } from '../session/Session.js';

/** An object for temporal storage of {@link Session} instances. */
export interface SessionRepository
  extends BotLifecycleObserver,
    IterableIterator<[string, Session<unknown>]> {
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

  /** Returns all registered sessions. */
  getSessions(): ReadonlyCollection<string, Session<unknown>>;

  /** Returns an iterator of all {@link Session}s. */
  values(): IterableIterator<Session<unknown>>;

  /** Returns an iterator of all session IDs. */
  keys(): IterableIterator<string>;

  /** Returns an iterator of all [ID, {@link Session}] pairs. */
  entries(): IterableIterator<[string, Session<unknown>]>;
}
