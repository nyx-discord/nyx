import type { InteractionTypes } from '@nyx-discord/types';
import type { Session } from '../../session/Session.js';
import type { SessionLimitRule } from '../rule/SessionLimitRule.js';

/** Options to construct a {@link SessionLimitExceededError}. */
type SessionLimitExceededErrorOptions<
  Types extends InteractionTypes = InteractionTypes,
> = {
  attempted: Session<unknown, Types>;
  existing: Session<unknown, Types>[];
  rule: SessionLimitRule<Types>;
};

/** Thrown when a session cannot start because it would exceed a registered session limit. */
export class SessionLimitExceededError<
  Types extends InteractionTypes = InteractionTypes,
> extends Error {
  public readonly attempted: Session<unknown, Types>;

  public readonly existing: Session<unknown, Types>[];

  public readonly rule: SessionLimitRule<Types>;

  constructor(params: SessionLimitExceededErrorOptions<Types>) {
    super('Session limit exceeded.');
    this.attempted = params.attempted;
    this.existing = params.existing;
    this.rule = params.rule;
  }
}
