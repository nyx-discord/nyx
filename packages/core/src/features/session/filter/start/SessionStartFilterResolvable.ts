import type { FilterResolvableFrom } from '../../../../filter/FilterResolvable';
import type { SessionStartFilter } from './SessionStartFilter';

export type SessionStartFilterResolvable<Result> = FilterResolvableFrom<
  SessionStartFilter<Result>
>;
