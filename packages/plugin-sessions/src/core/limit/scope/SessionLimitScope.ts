import type { Session } from '../../session/Session';

/**
 * Defines the scope within which session limits are enforced.
 *
 * Predefined scopes: {@link User}, {@link Guild}, {@link Channel}.
 * Use {@link composite} or {@link custom} for advanced scoping.
 */
export class SessionLimitScope {
  /** Limits sessions per user (by user ID). */
  public static readonly User = new SessionLimitScope(
    (session) => session.getStartInteraction().user.id,
  );

  /** Limits sessions per guild (by guild ID, or `'dm'` for DMs). */
  public static readonly Guild = new SessionLimitScope(
    (session) => session.getStartInteraction().guildId ?? 'dm',
  );

  /** Limits sessions per channel (by channel ID, or `'unknown'` if missing). */
  public static readonly Channel = new SessionLimitScope(
    (session) => session.getStartInteraction().channelId ?? 'unknown',
  );
  private readonly keyFn: (session: Session<unknown>) => string;

  private constructor(keyFn: (session: Session<unknown>) => string) {
    this.keyFn = keyFn;
  }

  /**
   * Creates a composite scope that combines multiple scopes.
   * Component keys are sorted alphabetically and joined with `:` for order-independent matching.
   */
  public static composite(...scopes: SessionLimitScope[]): SessionLimitScope {
    return new SessionLimitScope((session) =>
      scopes
        .map((s) => s.computeKey(session))
        .sort()
        .join(':'),
    );
  }

  /** Creates a scope with a custom key computation function. */
  public static custom(
    fn: (session: Session<unknown>) => string,
  ): SessionLimitScope {
    return new SessionLimitScope(fn);
  }

  /** Computes the scope key for the given session. */
  public computeKey(session: Session<unknown>): string {
    return this.keyFn(session);
  }
}
