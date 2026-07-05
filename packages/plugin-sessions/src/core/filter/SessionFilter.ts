import type { Filter } from '@nyx-discord/framework';
import type { Session } from '../session/Session';

/** A {@link Filter} for filtering Session updates. */
export interface SessionFilter<Result, Args extends unknown[]>
  extends Filter<Session<Result>, Args> {}
