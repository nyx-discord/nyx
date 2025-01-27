import type { Middleware } from '../../../middleware/Middleware.js';
import type { Session } from '../session/Session.js';

export interface SessionMiddleware<Args extends unknown[]>
  extends Middleware<Session<unknown>, Args> {}
