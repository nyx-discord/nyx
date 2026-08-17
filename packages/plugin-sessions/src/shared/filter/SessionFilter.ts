import type { Filter, InteractionTypes } from '@nyx-discord/types';
import type { Session } from '../session/Session.js';

/** A {@link Filter} for filtering Session updates. */
export interface SessionFilter<
  Result,
  Args extends unknown[],
  Types extends InteractionTypes = InteractionTypes,
> extends Filter<Session<Result, Types>, Args> {}
