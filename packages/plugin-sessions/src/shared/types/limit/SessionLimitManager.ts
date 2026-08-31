import type {
  Awaitable,
  Constructor,
  InteractionTypes,
} from '@nyx-discord/types';
import type { Session } from '../session/Session.js';
import type { SessionLimit } from './limit/SessionLimit.js';
import type { SessionLimitResolvable } from './limit/SessionLimitResolvable.js';

/** Manages concurrent session limits, checking and reserving slots before sessions start. */
export interface SessionLimitManager<
  Types extends InteractionTypes = InteractionTypes,
> {
  /**
   * Checks whether starting the given session would exceed any registered limits.
   *
   * @throws {SessionLimitExceededError} If the session exceeds a limit with an error action.
   */
  checkAndReserve(
    session: Session<unknown, Types>,
    meta: Record<string | symbol, unknown>,
  ): Awaitable<void>;

  /** Releases a session's slot. Counters are derived from the repository, so this is typically a no-op. */
  release(session: Session<unknown, Types>): void;

  /**
   * Registers session limit policies.
   *
   * @throws {IllegalStateError} If called after the plugin has started.
   */
  register(...limits: SessionLimitResolvable<Types>[]): void;

  /** Removes all limit policies for the given session constructor. */
  remove(sessionCtor: Constructor<Session<unknown, Types>>): void;

  /** Returns a read-only view of all registered limit policies. */
  getPolicies(): ReadonlyMap<
    Constructor<Session<unknown, Types>>,
    readonly SessionLimit<Types>[]
  >;
}
