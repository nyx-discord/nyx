import type { FilterResolvable } from './FilterResolvable';

/** An object whose execution can be filtered by a {@link Filter}. */
export interface Filterable<
  ReturnFilter extends FilterResolvable<unknown, unknown[]>,
> {
  /** Returns this object's filter. */
  getFilter(): ReturnFilter | null;
}
