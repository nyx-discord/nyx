/** Global end codes provided by nyx. */
export const SessionEndCodes = {
  /** End code for expired sessions. */
  Expired: Symbol('Expired'),
  /** Conventional end code for sessions that ended by themselves. */
  SelfEnded: Symbol('SelfEnded'),
} as const;
