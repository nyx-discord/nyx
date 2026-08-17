import type { ErrorHandler, InteractionTypes } from '@nyx-discord/types';
import type { Session } from '../session/Session.js';

export interface SessionErrorHandler<
  Args extends unknown[],
  Types extends InteractionTypes = InteractionTypes,
> extends ErrorHandler<Session<unknown, Types>, Args> {}
