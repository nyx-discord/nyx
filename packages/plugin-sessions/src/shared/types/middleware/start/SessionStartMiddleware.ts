import type { InteractionTypes } from '@nyx-discord/base';
import type { SessionStartArgs } from '../../execution/args/SessionStartArgs.js';
import type { SessionMiddleware } from '../SessionMiddleware.js';

export interface SessionStartMiddleware<
  Types extends InteractionTypes = InteractionTypes,
> extends SessionMiddleware<SessionStartArgs, Types> {}
