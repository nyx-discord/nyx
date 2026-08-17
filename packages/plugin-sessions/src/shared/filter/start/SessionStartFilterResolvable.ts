import type {
  FilterResolvableFrom,
  InteractionTypes,
} from '@nyx-discord/types';
import type { SessionStartFilter } from './SessionStartFilter.js';

export type SessionStartFilterResolvable<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> = FilterResolvableFrom<SessionStartFilter<Result, Types>>;
