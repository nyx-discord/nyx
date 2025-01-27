import type {
  MiddlewareList,
  SessionUpdateMiddleware as SesMiddleware,
  Tail,
} from '@nyx-discord/core';
import { SessionUpdateMiddlewareError } from '@nyx-discord/core';

import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';
import { SessionUpdateFilterCheckMiddleware } from '../filter/middleware/SessionUpdateFilterCheckMiddleware.js';

export class SessionUpdateMiddlewareList extends AbstractMiddlewareList<SesMiddleware> {
  public static create(): MiddlewareList<SesMiddleware> {
    const filterMiddleware = new SessionUpdateFilterCheckMiddleware();

    return new SessionUpdateMiddlewareList().add(filterMiddleware);
  }

  /** Wraps a generic error in a {@link SessionUpdateMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: SesMiddleware,
    error: Error,
    session: Parameters<SesMiddleware['check']>[0],
    ...args: Tail<Parameters<SesMiddleware['check']>>
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
