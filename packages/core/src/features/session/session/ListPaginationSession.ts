import type { PaginationSession } from './PaginationSession.js';

/**
 * A type of session that paginates a list of items.
 *
 * For example:
 * * A session that lists a user's moderations.
 * * A session that previews a list of ideos.
 */
export interface ListPaginationSession<Item, Result>
  extends PaginationSession<Result> {
  /** Returns the amount of items the session shows per page. */
  getItemsPerPage(): number;

  /** Returns the items of this current page. */
  getCurrentPageItems(): ReadonlyArray<Item>;
}
