import type {
  MiddlewareList,
  SessionStartMiddleware as SessMiddleware,
  Tail,
} from '@nyx-discord/core';
import { SessionStartMiddlewareError } from '@nyx-discord/core';

import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';
import { SessionStartFilterCheckMiddleware } from '../filter/middleware/SessionStartFilterCheckMiddleware.js';

export class SessionStartMiddlewareList extends AbstractMiddlewareList<SessMiddleware> {
  public static create(): MiddlewareList<SessMiddleware> {
    const filterMiddleware = new SessionStartFilterCheckMiddleware();

    return new SessionStartMiddlewareList().add(filterMiddleware);
  }

  /** Wraps a generic error in a {@link SessionStartMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: SessMiddleware,
    error: Error,
    session: Parameters<SessMiddleware['check']>[0],
    ...args: Tail<Parameters<SessMiddleware['check']>>
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
