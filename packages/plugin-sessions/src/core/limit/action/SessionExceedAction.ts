import type { Awaitable } from 'discord.js';
import type { Session } from '../../session/Session';
import type { SessionLimitRule } from '../rule/SessionLimitRule';

/** Context provided to exceed action handlers when a session limit is reached. */
export interface SessionExceedContext {
  attempted: Session<unknown>;
  existing: Session<unknown>[];
  rule: SessionLimitRule;
  meta: Record<string | symbol, unknown>;
}

/** Decision returned by a {@link SessionExceedAction} handler. */
export type ExceedDecision =
  | { proceed: false }
  | { proceed: true; displace: Session<unknown> | null };

/** Defines the action to take when a session limit is exceeded. */
export class SessionExceedAction {
  /** Returns a decision that prevents the session from starting. */
  public static readonly Error = new SessionExceedAction(() => ({
    proceed: false as const,
  }));
  private readonly fn: (ctx: SessionExceedContext) => Awaitable<ExceedDecision>;

  private constructor(
    fn: (ctx: SessionExceedContext) => Awaitable<ExceedDecision>,
  ) {
    this.fn = fn;
  }

  /**
   * Returns an action that displaces an existing session to make room for the new one.
   *
   * @param pick Optional function to choose which session to displace. Defaults to the first existing session.
   */
  public static displace(
    pick?: (existing: Session<unknown>[]) => Session<unknown>,
  ): SessionExceedAction {
    return new SessionExceedAction((ctx) => ({
      proceed: true as const,
      displace: pick ? pick([...ctx.existing]) : ctx.existing[0]!,
    }));
  }

  /** Returns an action with a custom handler for limit exceed decisions. */
  public static custom(
    handler: (ctx: SessionExceedContext) => Awaitable<ExceedDecision>,
  ): SessionExceedAction {
    return new SessionExceedAction(handler);
  }

  /**
   * Evaluates the exceed action for the given context.
   *
   * @returns The decision on whether to proceed and whether to displace another session.
   */
  public decide(ctx: SessionExceedContext): Awaitable<ExceedDecision> {
    return this.fn(ctx);
  }
}
