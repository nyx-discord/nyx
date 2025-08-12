import type { FilterResolvableFrom } from '../../../../filter/FilterResolvable';
import type { SessionUpdateFilter } from './SessionUpdateFilter';

export type SessionUpdateFilterResolvable<Result> = FilterResolvableFrom<
  SessionUpdateFilter<Result>
>;
