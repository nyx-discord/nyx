import type { InteractionTypes } from '@nyx-discord/base';
import type { Session } from '../../session/Session.js';

/** Decision returned by a {@link SessionExceedHandler} when a session limit is reached. */
export type ExceedDecision<Types extends InteractionTypes = InteractionTypes> =
  | { proceed: false }
  | { proceed: true; displace: Session<unknown, Types> | null };
