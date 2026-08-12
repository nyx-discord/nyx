import type { Filter } from './Filter';

/** An object that can be resolved to a {@link Filter}. */
export type FilterResolvable<Filtered, Args extends readonly unknown[]> =
  Filter<Filtered, Args> | Filter<Filtered, Args>['check'];

export type FilterResolvableFrom<From extends Filter<unknown, unknown[]>> =
  From extends Filter<infer Filtered, infer Args>
    ? FilterResolvable<Filtered, Args>
    : never;
