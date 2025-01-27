import type { Filter } from '../../../filter/Filter.js';
import type { Session } from '../session/Session.js';

/** A {@link Filter} for filtering Session updates. */
export interface SessionFilter<Result, Args extends unknown[]>
  extends Filter<Session<Result>, Args> {}
