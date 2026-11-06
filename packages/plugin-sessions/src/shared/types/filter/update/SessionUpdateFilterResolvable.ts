import type { FilterResolvableFrom, InteractionTypes } from '@nyx-discord/base';
import type { SessionUpdateFilter } from './SessionUpdateFilter.js';

export type SessionUpdateFilterResolvable<
  Result,
  Types extends InteractionTypes = InteractionTypes,
> = FilterResolvableFrom<SessionUpdateFilter<Result, Types>>;
