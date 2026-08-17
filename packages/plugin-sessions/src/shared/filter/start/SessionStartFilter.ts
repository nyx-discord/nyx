import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionStartArgs } from '../../execution/args/SessionStartArgs.js';
import type { SessionFilter } from '../SessionFilter.js';

export interface SessionStartFilter<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> extends SessionFilter<Result, SessionStartArgs, Types> {}
