import type { ErrorHandler } from '../../../error/handler/ErrorHandler.js';
import type { Session } from '../session/Session.js';

export interface SessionErrorHandler<Args extends unknown[]>
  extends ErrorHandler<Session<unknown>, Args> {}
