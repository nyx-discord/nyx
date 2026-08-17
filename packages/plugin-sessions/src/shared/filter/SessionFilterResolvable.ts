import type {
  FilterResolvableFrom,
  InteractionTypes,
} from '@nyx-discord/types';
import type { SessionFilter } from './SessionFilter.js';

export type SessionFilterResolvable<
  Result,
  Args extends unknown[],
  Types extends InteractionTypes = InteractionTypes,
> = FilterResolvableFrom<SessionFilter<Result, Args, Types>>;
