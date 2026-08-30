import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionUpdateArgs } from '../../execution/args/SessionUpdateArgs.js';
import type { SessionMiddleware } from '../SessionMiddleware.js';

export interface BaseSessionUpdateMiddleware<
  Types extends InteractionTypes = InteractionTypes,
> extends SessionMiddleware<SessionUpdateArgs<Types>, Types> {}
