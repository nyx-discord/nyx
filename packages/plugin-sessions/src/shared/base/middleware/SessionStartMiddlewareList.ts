import type {
  InteractionTypes,
  MiddlewareList,
  Tail,
} from '@nyx-discord/types';
import { AbstractMiddlewareList } from '@nyx-discord/base';
import { SessionStartMiddlewareError } from '../../types/middleware/errors/SessionStartMiddlewareError.js';
import type { SessionStartMiddleware } from '../../types/middleware/start/SessionStartMiddleware.js';
import { SessionStartFilterCheckMiddleware } from './SessionStartFilterCheckMiddleware.js';

/** {@link MiddlewareList} of {@link SessionStartMiddleware}s. */
export class SessionStartMiddlewareList<
  Types extends InteractionTypes = InteractionTypes,
> extends AbstractMiddlewareList<SessionStartMiddleware<Types>> {
  public static create<
    Types extends InteractionTypes = InteractionTypes,
  >(): MiddlewareList<SessionStartMiddleware<Types>> {
    const filterMiddleware = new SessionStartFilterCheckMiddleware<Types>();
    return new this().add(filterMiddleware);
  }

  /** Wraps a generic error in a {@link SessionStartMiddlewareError}. */
  protected override wrapError(
    erroredMiddleware: SessionStartMiddleware<Types>,
    error: Error,
    session: Parameters<SessionStartMiddleware<Types>['check']>[0],
    ...args: Tail<Parameters<SessionStartMiddleware<Types>['check']>>
  ): Error {
    const [meta] = args;
    return new SessionStartMiddlewareError<Types>(
      error,
      erroredMiddleware,
      session,
      meta,
    );
  }
}
