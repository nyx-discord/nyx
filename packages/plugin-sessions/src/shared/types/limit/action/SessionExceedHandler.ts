import type { Awaitable, InteractionTypes } from '@nyx-discord/base';
import type { ExceedDecision } from './ExceedDecision.js';
import type { SessionExceedContext } from './SessionExceedContext.js';

/** An object that decides what happens when a session limit is exceeded. */
export interface SessionExceedHandler<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** Returns whether the attempted session may proceed, and which session to displace if so. */
  decide(ctx: SessionExceedContext<Types>): Awaitable<ExceedDecision<Types>>;
}
