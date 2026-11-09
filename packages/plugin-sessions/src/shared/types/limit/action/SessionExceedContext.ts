import type { InteractionTypes } from '@nyx-discord/base';
import type { Session } from '../../session/Session.js';
import type { SessionLimitRule } from '../rule/SessionLimitRule.js';

/** Context provided to exceed action handlers when a session limit is reached. */
export interface SessionExceedContext<
  Types extends InteractionTypes = InteractionTypes,
> {
  attempted: Session<unknown, Types>;
  existing: Session<unknown, Types>[];
  rule: SessionLimitRule<Types>;
  meta: Record<string | symbol, unknown>;
}
