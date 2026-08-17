import type { Awaitable, InteractionTypes } from '@nyx-discord/types';
import type { Session } from '../../session/Session.js';
import type { SessionLimitRule } from '../rule/SessionLimitRule.js';

/** Context provided to exceed action handlers when a session limit is reached. */
export interface SessionExceedContext<
  Types extends InteractionTypes = InteractionTypes,
> {
  attempted: Session<unknown, Types>;
  existing: Session<unknown, Types>[];
  rule: SessionLimitRule<Types>;
  meta: Record<string | symbol, unknown>;
}

/** Decision returned by a {@link SessionExceedAction} handler. */
export type ExceedDecision<Types extends InteractionTypes = InteractionTypes> =
  | { proceed: false }
  | { proceed: true; displace: Session<unknown, Types> | null };

/** Defines the action to take when a session limit is exceeded. */
export class SessionExceedAction<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** Returns a decision that prevents the session from starting. */
  public static readonly Error: SessionExceedAction = new SessionExceedAction(
    () => ({ proceed: false as const }),
  );

  private readonly fn: (
    ctx: SessionExceedContext<Types>,
  ) => Awaitable<ExceedDecision<Types>>;

  private constructor(
    fn: (ctx: SessionExceedContext<Types>) => Awaitable<ExceedDecision<Types>>,
  ) {
    this.fn = fn;
  }

  /**
   * Returns an action that displaces an existing session to make room for the new one.
   *
   * @param pick Optional function to choose which session to displace. Defaults to the first existing session.
   */
  public static displace<Types extends InteractionTypes = InteractionTypes>(
    pick?: (existing: Session<unknown, Types>[]) => Session<unknown, Types>,
  ): SessionExceedAction<Types> {
    return new SessionExceedAction<Types>((ctx) => ({
      proceed: true as const,
      displace: pick ? pick([...ctx.existing]) : ctx.existing[0]!,
    }));
  }

  /** Returns an action with a custom handler for limit exceed decisions. */
  public static custom<Types extends InteractionTypes = InteractionTypes>(
    handler: (
      ctx: SessionExceedContext<Types>,
    ) => Awaitable<ExceedDecision<Types>>,
  ): SessionExceedAction<Types> {
    return new SessionExceedAction<Types>(handler);
  }

  /**
   * Evaluates the exceed action for the given context.
   *
   * @returns The decision on whether to proceed and whether to displace another session.
   */
  public decide(
    ctx: SessionExceedContext<Types>,
  ): Awaitable<ExceedDecision<Types>> {
    return this.fn(ctx);
  }
}
