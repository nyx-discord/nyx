import type { Constructor } from '@nyx-discord/framework';
import type { SessionLimit } from '../limit/SessionLimit';

/** Thrown when multiple session limit policies match a session constructor without disambiguating predicates. */
export class AmbiguousSessionLimitError extends Error {
  public readonly sessionCtor: Constructor;

  public readonly matched: SessionLimit[];

  constructor(sessionCtor: Constructor, matched: SessionLimit[]) {
    super(
      `Multiple limit policies matched constructor '${String(sessionCtor)}'. Mark them with mutually exclusive predicates.`,
    );
    this.sessionCtor = sessionCtor;
    this.matched = matched;
  }
}
