import type {
  MiddlewareResponse,
  Session,
  SessionFilter,
  SessionStartArgs,
  SessionUpdateArgs,
} from '@nyx-discord/core';

import { AbstractMiddleware } from '../../../../middleware/AbstractMiddleware.js';

export abstract class AbstractSessionFilterCheckMiddleware<
  Args extends SessionUpdateArgs | SessionStartArgs,
> extends AbstractMiddleware<Session<unknown>, Args> {
  protected override locked = true;

  public async check(
    session: Session<unknown>,
    ...args: Args
  ): Promise<MiddlewareResponse> {
    const filter = this.extractFilter(session);
    if (!filter) return this.true();

    const result = await filter.check(session, ...args);
    if (!result) return this.false();

    return this.true();
  }

  /** Extracts the filter from the session. */
  protected abstract extractFilter(
    session: Session<unknown>,
  ): SessionFilter<unknown, Args> | null;
}
