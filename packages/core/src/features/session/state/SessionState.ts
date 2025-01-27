/** Enum of possible session states. */
export const SessionStateEnum = {
  Uninitalized: 'uninitialized',
  Running: 'running',
  Ended: 'ended',
} as const;

/** Type of values of {@link SessionStateEnum}. */
export type SessionState =
  (typeof SessionStateEnum)[keyof typeof SessionStateEnum];
