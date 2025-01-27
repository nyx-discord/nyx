import type { SessionStartArgs } from '../execution/args/SessionStartArgs.js';
import type { SessionFilter } from './SessionFilter.js';

export interface SessionStartFilter<Result>
  extends SessionFilter<Result, SessionStartArgs> {}
