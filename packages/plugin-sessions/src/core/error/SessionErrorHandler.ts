import type { ErrorHandler } from '@nyx-discord/framework';
import type { Session } from '../session/Session';

export interface SessionErrorHandler<Args extends unknown[]>
  extends ErrorHandler<Session<unknown>, Args> {}
