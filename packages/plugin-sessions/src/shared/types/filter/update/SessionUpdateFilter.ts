import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionUpdateArgs } from '../../execution/args/SessionUpdateArgs.js';
import type { SessionFilter } from '../SessionFilter.js';

export interface SessionUpdateFilter<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> extends SessionFilter<Result, SessionUpdateArgs<Types>, Types> {}
