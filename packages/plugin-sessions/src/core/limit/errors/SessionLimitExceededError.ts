import type { Session } from '../../session/Session';
import type { SessionLimitRule } from '../rule/SessionLimitRule';

/** Thrown when a session cannot start because it would exceed a registered session limit. */
export class SessionLimitExceededError extends Error {
  public readonly attempted: Session<unknown>;

  public readonly existing: Session<unknown>[];

  public readonly rule: SessionLimitRule;

  constructor(params: {
    attempted: Session<unknown>;
    existing: Session<unknown>[];
    rule: SessionLimitRule;
  }) {
    super('Session limit exceeded.');
    this.attempted = params.attempted;
    this.existing = params.existing;
    this.rule = params.rule;
  }
}
