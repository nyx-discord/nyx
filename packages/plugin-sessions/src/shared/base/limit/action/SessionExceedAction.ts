import type { Awaitable, InteractionTypes } from '@nyx-discord/base';
import type { ExceedDecision } from '../../../types/limit/action/ExceedDecision.js';
import type { SessionExceedContext } from '../../../types/limit/action/SessionExceedContext.js';
import type { SessionExceedHandler } from '../../../types/limit/action/SessionExceedHandler.js';
import type { Session } from '../../../types/session/Session.js';
import { SessionStateEnum } from '../../../types/state/SessionState.js';

/** Defines the action to take when a session limit is exceeded. */
export class SessionExceedAction<
  Types extends InteractionTypes = InteractionTypes,
> implements SessionExceedHandler<Types> {
  /** Returns a decision that prevents the session from starting. */
  // any: sessions are invariant in their interaction types, and this action fits rules of every one
  public static readonly Error: SessionExceedAction<any> =
    new SessionExceedAction<any>(() => ({ proceed: false as const }));

  protected readonly fn: (
    ctx: SessionExceedContext<Types>,
  ) => Awaitable<ExceedDecision<Types>>;

  protected constructor(
    fn: (ctx: SessionExceedContext<Types>) => Awaitable<ExceedDecision<Types>>,
  ) {
    this.fn = fn;
  }

  /**
   * Returns an action that displaces an existing session to make room for the new one.
   *
   * @param pick Optional function to choose which session to displace. Defaults to the oldest running session, and blocks the new session if every existing one is still starting.
   */
  public static displace<Types extends InteractionTypes = InteractionTypes>(
    pick?: (existing: Session<unknown, Types>[]) => Session<unknown, Types>,
  ): SessionExceedAction<Types> {
    return new SessionExceedAction<Types>((ctx) => {
      if (pick) {
        return { proceed: true as const, displace: pick([...ctx.existing]) };
      }

      const running = ctx.existing.find(
        (session) => session.getState() === SessionStateEnum.Running,
      );
      if (!running) return { proceed: false as const };

      return { proceed: true as const, displace: running };
    });
  }

  /** Returns an action with a custom handler for limit exceed decisions. */
  public static custom<Types extends InteractionTypes = InteractionTypes>(
    handler: (
      ctx: SessionExceedContext<Types>,
    ) => Awaitable<ExceedDecision<Types>>,
  ): SessionExceedAction<Types> {
    return new SessionExceedAction<Types>(handler);
  }

  /** @inheritdoc */
  public decide(
    ctx: SessionExceedContext<Types>,
  ): Awaitable<ExceedDecision<Types>> {
    return this.fn(ctx);
  }
}
