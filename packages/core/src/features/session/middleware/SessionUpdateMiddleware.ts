import type { SessionUpdateArgs } from '../execution/args/SessionUpdateArgs.js';
import type { SessionMiddleware } from './SessionMiddleware.js';

export interface SessionUpdateMiddleware
  extends SessionMiddleware<SessionUpdateArgs> {}
