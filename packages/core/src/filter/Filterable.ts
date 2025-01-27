import type { Filter } from './Filter.js';

/** An object whose execution can be filtered by a {@link Filter}. */
export interface Filterable<ReturnFilter extends Filter<unknown, unknown[]>> {
  /** Returns this object's filter. */
  getFilter(): ReturnFilter | null;
}
