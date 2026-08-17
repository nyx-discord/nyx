import type { InteractionTypes } from '@nyx-discord/types';
import type { Session } from '../../session/Session.js';
import type { SessionExceedAction } from '../action/SessionExceedAction.js';
import type { SessionLimitScope } from '../scope/SessionLimitScope.js';

/** A single concurrency rule within a session limit policy. */
export interface SessionLimitRule<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** Maximum number of concurrent sessions allowed within the scope. */
  max: number;
  /** The scope within which to enforce the limit. */
  scope:
    SessionLimitScope<Types> | ((session: Session<unknown, Types>) => string);
  /** The action to take when the limit is exceeded. */
  onExceed: SessionExceedAction<Types>;
}
