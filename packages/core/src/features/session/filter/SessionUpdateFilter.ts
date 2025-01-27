import type { SessionUpdateArgs } from '../execution/args/SessionUpdateArgs.js';
import type { SessionFilter } from './SessionFilter.js';

export interface SessionUpdateFilter<Result>
  extends SessionFilter<Result, SessionUpdateArgs> {}
