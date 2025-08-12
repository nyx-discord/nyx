import type { SessionUpdateArgs } from '../../execution/args/SessionUpdateArgs';
import type { SessionFilter } from '../SessionFilter';

export interface SessionUpdateFilter<Result>
  extends SessionFilter<Result, SessionUpdateArgs> {}
