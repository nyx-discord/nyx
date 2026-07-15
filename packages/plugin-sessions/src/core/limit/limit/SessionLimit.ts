import type { Constructor } from '@nyx-discord/framework';
import type { Awaitable } from 'discord.js';
import type { Session } from '../../session/Session';
import type { SessionLimitRule } from '../rule/SessionLimitRule';

/** A session limit policy defining concurrency constraints for a session type. */
export interface SessionLimit {
  /** The session constructor this limit applies to. */
  session: Constructor<Session<unknown>>;
  /** The rules defining scope and max concurrency for this limit. */
  rules: SessionLimitRule[];
  /** Optional predicate to conditionally apply this limit based on session metadata. */
  predicate?: (
    session: Session<unknown>,
    meta: Record<string | symbol, unknown>,
  ) => Awaitable<boolean>;
}
