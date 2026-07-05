import type { SessionStartArgs } from '../../execution/args/SessionStartArgs';
import type { SessionMiddleware } from '../SessionMiddleware';

export interface SessionStartMiddleware
  extends SessionMiddleware<SessionStartArgs> {}
