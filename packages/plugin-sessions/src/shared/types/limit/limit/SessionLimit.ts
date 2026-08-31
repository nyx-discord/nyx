import type {
  Awaitable,
  Constructor,
  InteractionTypes,
} from '@nyx-discord/types';
import type { Session } from '../../session/Session.js';
import type { SessionLimitRule } from '../rule/SessionLimitRule.js';

/** A session limit policy defining concurrency constraints for a session type. */
export interface SessionLimit<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** The session constructor this limit applies to. */
  session: Constructor<Session<unknown, any>>;
  /** The rules defining scope and max concurrency for this limit. */
  rules: SessionLimitRule<Types>[];
  /** Optional predicate to conditionally apply this limit based on session metadata. */
  predicate?: (
    session: Session<unknown, any>,
    meta: Record<string | symbol, unknown>,
  ) => Awaitable<boolean>;
}
