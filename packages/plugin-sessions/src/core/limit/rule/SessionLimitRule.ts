import type { SessionExceedAction } from '../action/SessionExceedAction';
import type { Session } from '../../session/Session';
import type { SessionLimitScope } from '../scope/SessionLimitScope';

/** A single concurrency rule within a session limit policy. */
export interface SessionLimitRule {
  /** Maximum number of concurrent sessions allowed within the scope. */
  max: number;
  /** The scope within which to enforce the limit. */
  scope: SessionLimitScope | ((session: Session<unknown>) => string);
  /** The action to take when the limit is exceeded. */
  onExceed: SessionExceedAction;
}
