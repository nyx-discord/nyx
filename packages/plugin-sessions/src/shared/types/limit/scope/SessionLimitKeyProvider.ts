import type { InteractionTypes } from '@nyx-discord/base';
import type { Session } from '../../session/Session.js';

/** An object that computes the scope key of a session. Sessions with the same key count towards the same limit. */
export interface SessionLimitKeyProvider<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** Computes the scope key for the given session. */
  computeKey(session: Session<unknown, Types>): string;
}
