import type { FilterResolvableFrom } from '../../../filter/FilterResolvable';
import type { SessionFilter } from './SessionFilter';

export type SessionFilterResolvable<
  Result,
  Args extends unknown[],
> = FilterResolvableFrom<SessionFilter<Result, Args>>;
