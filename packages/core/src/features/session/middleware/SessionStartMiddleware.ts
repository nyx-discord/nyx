import type { SessionStartArgs } from '../execution/args/SessionStartArgs.js';
import type { SessionMiddleware } from './SessionMiddleware.js';

export interface SessionStartMiddleware
  extends SessionMiddleware<SessionStartArgs> {}
