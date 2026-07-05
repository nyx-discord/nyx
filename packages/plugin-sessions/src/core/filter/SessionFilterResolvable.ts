import type { FilterResolvableFrom } from '@nyx-discord/framework';
import type { SessionFilter } from './SessionFilter';

export type SessionFilterResolvable<
  Result,
  Args extends unknown[],
> = FilterResolvableFrom<SessionFilter<Result, Args>>;
