import type { FilterResolvableFrom } from '@nyx-discord/framework';
import type { SessionStartFilter } from './SessionStartFilter';

export type SessionStartFilterResolvable<Result> = FilterResolvableFrom<
  SessionStartFilter<Result>
>;
