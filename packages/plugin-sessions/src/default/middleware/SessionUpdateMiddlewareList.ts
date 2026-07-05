import type { MiddlewareList, Tail } from '@nyx-discord/framework';
import { AbstractMiddlewareList } from '@nyx-discord/framework';
import { SessionUpdateMiddlewareError } from '../../core/middleware/errors/SessionUpdateMiddlewareError';
import type { SessionUpdateMiddleware } from '../../core/middleware/update/SessionUpdateMiddleware';
import { SessionUpdateFilterCheckMiddleware } from '../filter/middleware/SessionUpdateFilterCheckMiddleware';

export class SessionUpdateMiddlewareList extends AbstractMiddlewareList<SessionUpdateMiddleware> {
  public static create(): MiddlewareList<SessionUpdateMiddleware> {
    const filterMiddleware = new SessionUpdateFilterCheckMiddleware();
    return new this().add(filterMiddleware);
  }

  /** Wraps a generic error in a {@link SessionUpdateMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: SessionUpdateMiddleware,
    error: Error,
    session: Parameters<SessionUpdateMiddleware['check']>[0],
    ...args: Tail<Parameters<SessionUpdateMiddleware['check']>>
  ): Error {
    const [interaction, meta] = args;

    return new SessionUpdateMiddlewareError(
      error,
      erroredMiddleware,
      session,
      interaction,
      meta,
    );
  }
}
