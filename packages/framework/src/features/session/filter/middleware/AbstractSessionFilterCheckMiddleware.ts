import type {
  MiddlewareResponse,
  Session,
  SessionFilterResolvable,
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

    const result =
      typeof filter === 'object'
        ? await filter.check(session, ...args)
        : await filter.bind(session)(session, ...args);
    if (!result) return this.false();

    return this.true();
  }

  /** Extracts the filter from the session. */
  protected abstract extractFilter(
    session: Session<unknown>,
  ): SessionFilterResolvable<unknown, Args> | null;
}
