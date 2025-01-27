import type { Session } from './Session.js';

/** A type of session that can be paginated. For example, {@link ListPaginationSession} or {@link StagePaginationSession}. */
export interface PaginationSession<Result> extends Session<Result> {
  /** Returns the current page of this session. */
  getCurrentPage(): number;

  /** Returns the next page of this session, or `null` if there is no next page. */
  getNextPage(): number | null;

  /** Returns the previous page of this session, or `null` if there is no previous page. */
  getPreviousPage(): number | null;
}
