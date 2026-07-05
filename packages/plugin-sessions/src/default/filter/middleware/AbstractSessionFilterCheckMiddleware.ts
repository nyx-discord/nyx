import type { MiddlewareResponse } from '@nyx-discord/framework';
import { AbstractMiddleware } from '@nyx-discord/framework';
import type { SessionStartArgs } from '../../../core/execution/args/SessionStartArgs';
import type { SessionUpdateArgs } from '../../../core/execution/args/SessionUpdateArgs';
import type { SessionFilterResolvable } from '../../../core/filter/SessionFilterResolvable';
import type { Session } from '../../../core/session/Session';

export abstract class AbstractSessionFilterCheckMiddleware<
  Args extends SessionUpdateArgs | SessionStartArgs,
> extends AbstractMiddleware<Session<unknown>, Args> {
  protected override protected = true;

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
