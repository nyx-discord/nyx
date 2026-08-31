import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionLimit } from './SessionLimit.js';
import type { SessionLimitBuilder } from '../../../base/limit/limit/SessionLimitBuilder.js';

/** Type that can be resolved to a {@link SessionLimit}. */
export type SessionLimitResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = SessionLimit<Types> | SessionLimitBuilder<Types>;
