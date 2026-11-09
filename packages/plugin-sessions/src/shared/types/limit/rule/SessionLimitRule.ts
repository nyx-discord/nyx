import type { InteractionTypes } from '@nyx-discord/base';
import type { Session } from '../../session/Session.js';
import type { SessionExceedHandler } from '../action/SessionExceedHandler.js';
import type { SessionLimitKeyProvider } from '../scope/SessionLimitKeyProvider.js';

/** A single concurrency rule within a session limit policy. */
export interface SessionLimitRule<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** Maximum number of concurrent sessions allowed within the scope. */
  max: number;
  /** The scope within which to enforce the limit. */
  scope:
    | SessionLimitKeyProvider<Types>
    | ((session: Session<unknown, Types>) => string);
  /** The action to take when the limit is exceeded. */
  onExceed: SessionExceedHandler<Types>;
}
