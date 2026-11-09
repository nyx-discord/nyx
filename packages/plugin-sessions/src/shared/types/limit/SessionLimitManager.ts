import type {
  Awaitable,
  Constructor,
  InteractionTypes,
} from '@nyx-discord/base';
import type { Session } from '../session/Session.js';
import type { SessionLimit } from './limit/SessionLimit.js';
import type { SessionLimitResolvable } from './limit/SessionLimitResolvable.js';

/** Manages concurrent session limits, checking and reserving slots before sessions start. */
export interface SessionLimitManager<
  Types extends InteractionTypes = InteractionTypes,
> {
  /**
   * Checks whether starting the given session would exceed any registered limits, and reserves its slot if it doesn't.
   *
   * Sessions chosen for displacement stop counting towards limits, but are only ended on {@link commit}.
   *
   * @throws {SessionLimitExceededError} If the session exceeds a limit with an error action.
   */
  checkAndReserve(
    session: Session<unknown, Types>,
    meta: Record<string | symbol, unknown>,
  ): Awaitable<void>;

  /** Ends the sessions displaced to make room for the given session. Called once it has started. */
  commit(session: Session<unknown, Types>): Awaitable<void>;

  /** Releases a session's reserved slot, and keeps running any session it was going to displace. Called when the session ends, expires or fails to start. */
  release(session: Session<unknown, Types>): void;

  /**
   * Registers session limit policies.
   *
   * @throws {IllegalStateError} If called after the plugin has started.
   */
  register(...limits: SessionLimitResolvable<Types>[]): void;

  /**
   * Removes all limit policies for the given session constructor.
   *
   * @throws {IllegalStateError} If called after the plugin has started.
   */
  remove(sessionCtor: Constructor<Session<unknown, Types>>): void;

  /** Returns a read-only view of all registered limit policies. */
  getPolicies(): ReadonlyMap<
    Constructor<Session<unknown, Types>>,
    readonly SessionLimit<Types>[]
  >;
}
