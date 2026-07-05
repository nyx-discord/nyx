import type { MiddlewareList, Tail } from '@nyx-discord/framework';
import { AbstractMiddlewareList } from '@nyx-discord/framework';
import { SessionStartMiddlewareError } from '../../core/middleware/errors/SessionStartMiddlewareError';
import type { SessionStartMiddleware } from '../../core/middleware/start/SessionStartMiddleware';
import { SessionStartFilterCheckMiddleware } from '../filter/middleware/SessionStartFilterCheckMiddleware';

export class SessionStartMiddlewareList extends AbstractMiddlewareList<SessionStartMiddleware> {
  public static create(): MiddlewareList<SessionStartMiddleware> {
    const filterMiddleware = new SessionStartFilterCheckMiddleware();
    return new this().add(filterMiddleware);
  }

  /** Wraps a generic error in a {@link SessionStartMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: SessionStartMiddleware,
    error: Error,
    session: Parameters<SessionStartMiddleware['check']>[0],
    ...args: Tail<Parameters<SessionStartMiddleware['check']>>
  ): Error {
    const [meta] = args;
    return new SessionStartMiddlewareError(
      error,
      erroredMiddleware,
      session,
      meta,
    );
  }
}
