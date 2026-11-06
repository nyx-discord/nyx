import type { InteractionTypes } from '@nyx-discord/base';
import type { SessionLimitBuilder } from '../../../base/limit/limit/SessionLimitBuilder.js';
import type { SessionLimit } from './SessionLimit.js';

/** Type that can be resolved to a {@link SessionLimit}. */
export type SessionLimitResolvable<
  Types extends InteractionTypes = InteractionTypes,
> = SessionLimit<Types> | SessionLimitBuilder<Types>;
