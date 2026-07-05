import type { Middleware } from '@nyx-discord/framework';
import type { Session } from '../session/Session';

export interface SessionMiddleware<Args extends unknown[]>
  extends Middleware<Session<unknown>, Args> {}
