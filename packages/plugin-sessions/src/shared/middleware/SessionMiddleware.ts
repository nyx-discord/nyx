import type { InteractionTypes, Middleware } from '@nyx-discord/types';
import type { Session } from '../session/Session.js';

export interface SessionMiddleware<
  Args extends unknown[],
  Types extends InteractionTypes = InteractionTypes,
> extends Middleware<Session<unknown, Types>, Args> {}
