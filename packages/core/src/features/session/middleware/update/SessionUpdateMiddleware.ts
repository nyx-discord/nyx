import type { SessionUpdateArgs } from '../../execution/args/SessionUpdateArgs';
import type { SessionMiddleware } from '../SessionMiddleware';

export interface SessionUpdateMiddleware
  extends SessionMiddleware<SessionUpdateArgs> {}
