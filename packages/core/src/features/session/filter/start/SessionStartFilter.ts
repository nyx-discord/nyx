import type { SessionStartArgs } from '../../execution/args/SessionStartArgs';
import type { SessionFilter } from '../SessionFilter';

export interface SessionStartFilter<Result>
  extends SessionFilter<Result, SessionStartArgs> {}
