import type { FilterResolvableFrom } from '@nyx-discord/framework';
import type { SessionUpdateFilter } from './SessionUpdateFilter';

export type SessionUpdateFilterResolvable<Result> = FilterResolvableFrom<
  SessionUpdateFilter<Result>
>;
