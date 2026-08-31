import type { Constructor, InteractionTypes } from '@nyx-discord/types';
import type { SessionLimit } from '../limit/SessionLimit.js';

/** Thrown when multiple session limit policies match a session constructor without disambiguating predicates. */
export class AmbiguousSessionLimitError<
  Types extends InteractionTypes = InteractionTypes,
> extends Error {
  public readonly sessionCtor: Constructor;

  public readonly matched: SessionLimit<Types>[];

  constructor(sessionCtor: Constructor, matched: SessionLimit<Types>[]) {
    super(
      `Multiple limit policies matched constructor '${String(sessionCtor)}'. Mark them with mutually exclusive predicates.`,
    );
    this.sessionCtor = sessionCtor;
    this.matched = matched;
  }
}
