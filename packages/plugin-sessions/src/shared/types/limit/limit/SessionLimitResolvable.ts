import type { InteractionTypes } from '@nyx-discord/base';
import type { SessionLimit } from './SessionLimit.js';

/** Type that can be resolved to a {@link SessionLimit}: the limit itself, or a builder of one. */
export type SessionLimitResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = SessionLimit<Types> | { toSessionLimit(): SessionLimit<Types> };
