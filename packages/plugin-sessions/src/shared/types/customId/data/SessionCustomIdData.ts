/** Data that can be de/serialized from/to a session customId. */
export interface SessionCustomIdData {
  /** The session's ID. */
  id: string;
  /** Extra user-provided data, if desired. */
  extra: string | null;
  /** The session's page to switch to if desired, if this is a {@link PaginationSession}. */
  page: number | null;
}
