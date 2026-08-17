import type { InteractionTypes, MiddlewareResponse } from '@nyx-discord/types';
import { AbstractMiddleware } from '@nyx-discord/base';
import type { SessionStartArgs } from '../execution/args/SessionStartArgs.js';
import type { SessionUpdateArgs } from '../execution/args/SessionUpdateArgs.js';
import type { SessionFilterResolvable } from '../filter/SessionFilterResolvable.js';
import type { Session } from '../session/Session.js';

/** Base {@link AbstractMiddleware Middleware} that checks a session's filter. */
export abstract class BaseSessionFilterCheckMiddleware<
  Types extends InteractionTypes = InteractionTypes,
  Args extends SessionUpdateArgs<Types> | SessionStartArgs =
    SessionUpdateArgs<Types> | SessionStartArgs,
> extends AbstractMiddleware<Session<unknown, Types>, Args> {
  protected override protected = true;

  public async check(
    session: Session<unknown, Types>,
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
    session: Session<unknown, Types>,
  ): SessionFilterResolvable<unknown, Args, Types> | null;
}
