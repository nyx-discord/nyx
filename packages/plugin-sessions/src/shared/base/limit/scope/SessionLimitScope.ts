import type { InteractionTypes } from '@nyx-discord/types';
import type { Session } from '../../../types/session/Session.js';

/**
 * Defines the scope within which session limits are enforced.
 *
 * Predefined scopes: {@link User}, {@link Guild}, {@link Channel}.
 * Use {@link composite} or {@link custom} for advanced scoping.
 */
export class SessionLimitScope<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** Limits sessions per user (by user ID). */
  public static readonly User: SessionLimitScope<never> = new SessionLimitScope(
    (session) => session.getUserId(),
  );

  /** Limits sessions per guild (by guild ID, or `'dm'` for DMs). */
  public static readonly Guild: SessionLimitScope<never> =
    new SessionLimitScope((session) => session.getGuildId() ?? 'dm');

  /** Limits sessions per channel (by channel ID, or `'unknown'` if missing). */
  public static readonly Channel: SessionLimitScope<never> =
    new SessionLimitScope((session) => session.getChannelId());

  private readonly keyFn: (session: Session<unknown, any>) => string;

  private constructor(keyFn: (session: Session<unknown, any>) => string) {
    this.keyFn = keyFn;
  }

  /**
   * Creates a composite scope that combines multiple scopes.
   * Component keys are sorted alphabetically and joined with `:` for order-independent matching.
   */
  public static composite<Types extends InteractionTypes = InteractionTypes>(
    ...scopes: SessionLimitScope<Types>[]
  ): SessionLimitScope<Types> {
    return new SessionLimitScope<Types>((session) =>
      scopes
        .map((s) => s.computeKey(session))
        .sort()
        .join(':'),
    );
  }

  /** Creates a scope with a custom key computation function. */
  public static custom<Types extends InteractionTypes = InteractionTypes>(
    fn: (session: Session<unknown, Types>) => string,
  ): SessionLimitScope<Types> {
    return new SessionLimitScope<Types>(fn);
  }

  /** Computes the scope key for the given session. */
  public computeKey(session: Session<unknown, Types>): string {
    return this.keyFn(session);
  }
}
