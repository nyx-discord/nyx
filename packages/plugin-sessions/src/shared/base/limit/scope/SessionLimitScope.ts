import type { InteractionTypes } from '@nyx-discord/base';
import type { SessionLimitKeyProvider } from '../../../types/limit/scope/SessionLimitKeyProvider.js';
import type { Session } from '../../../types/session/Session.js';

/**
 * Defines the scope within which session limits are enforced.
 *
 * Predefined scopes: {@link User}, {@link Guild}, {@link Channel}.
 * Use {@link composite} or {@link custom} for advanced scoping.
 */
export class SessionLimitScope<
  Types extends InteractionTypes = InteractionTypes,
> implements SessionLimitKeyProvider<Types> {
  /** Limits sessions per user (by user ID). */
  public static readonly User: SessionLimitScope = new SessionLimitScope(
    (session) => session.getUserId(),
  );

  /** Limits sessions per guild (by guild ID, or `'dm'` for DMs). */
  public static readonly Guild: SessionLimitScope = new SessionLimitScope(
    (session) => session.getGuildId() ?? 'dm',
  );

  /** Limits sessions per channel (by channel ID, or `'unknown'` if missing). */
  public static readonly Channel: SessionLimitScope = new SessionLimitScope(
    (session) => session.getChannelId(),
  );

  protected readonly keyFn: (session: Session<unknown, Types>) => string;

  protected constructor(keyFn: (session: Session<unknown, Types>) => string) {
    this.keyFn = keyFn;
  }

  /**
   * Creates a composite scope that combines multiple scopes.
   * Component keys are sorted alphabetically and joined with `:` for order-independent matching.
   */
  public static composite<Types extends InteractionTypes = InteractionTypes>(
    ...scopes: SessionLimitKeyProvider<Types>[]
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

  /** @inheritdoc */
  public computeKey(session: Session<unknown, Types>): string {
    return this.keyFn(session);
  }
}
