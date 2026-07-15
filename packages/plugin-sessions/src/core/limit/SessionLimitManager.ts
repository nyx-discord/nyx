import type { Constructor } from '@nyx-discord/framework';
import type { Awaitable } from 'discord.js';
import type { Session } from '../session/Session';
import type { SessionLimit } from './limit/SessionLimit';
import type { SessionLimitResolvable } from './limit/SessionLimitResolvable';

/** Manages concurrent session limits, checking and reserving slots before sessions start. */
export interface SessionLimitManager {
  /**
   * Checks whether starting the given session would exceed any registered limits.
   *
   * @throws {SessionLimitExceededError} If the session exceeds a limit with an error action.
   */
  checkAndReserve(
    session: Session<unknown>,
    meta: Record<string | symbol, unknown>,
  ): Awaitable<void>;

  /** Releases a session's slot. Counters are derived from the repository, so this is typically a no-op. */
  release(session: Session<unknown>): void;

  /**
   * Registers session limit policies.
   *
   * @throws {IllegalStateError} If called after the plugin has started.
   */
  register(...limits: SessionLimitResolvable[]): void;

  /** Removes all limit policies for the given session constructor. */
  remove(sessionCtor: Constructor<Session<unknown>>): void;

  /** Returns a read-only view of all registered limit policies. */
  getPolicies(): ReadonlyMap<
    Constructor<Session<unknown>>,
    readonly SessionLimit[]
  >;
}
