/** Global end codes provided by nyx. */
export const SessionEndCodes = {
  /** End code for expired sessions. */
  Expired: Symbol('Expired'),
  /** Conventional end code for sessions that ended by themselves. */
  SelfEnded: Symbol('SelfEnded'),
  /** End code for sessions that were displaced by a session limit rule. */
  Displaced: Symbol('Displaced'),
} as const;
