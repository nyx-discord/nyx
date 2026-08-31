import { AbstractMiddlewareList } from '@nyx-discord/base';
import type {
  InteractionTypes,
  MiddlewareList,
  Tail,
} from '@nyx-discord/types';
import { SessionUpdateMiddlewareError } from '../../types/middleware/errors/SessionUpdateMiddlewareError.js';
import { SessionUpdateFilterCheckMiddleware } from './SessionUpdateFilterCheckMiddleware.js';
import type { SessionUpdateMiddleware } from '../../types/middleware/update/SessionUpdateMiddleware.js';

/** {@link MiddlewareList} of {@link SessionUpdateMiddleware}s. */
export class SessionUpdateMiddlewareList<
  Types extends InteractionTypes = InteractionTypes,
> extends AbstractMiddlewareList<SessionUpdateMiddleware<Types>> {
  public static create<
    Types extends InteractionTypes = InteractionTypes,
  >(): MiddlewareList<SessionUpdateMiddleware<Types>> {
    const filterMiddleware = new SessionUpdateFilterCheckMiddleware<Types>();
    return new this().add(filterMiddleware);
  }

  /** Wraps a generic error in a {@link SessionUpdateMiddlewareError}. */
  protected override wrapError(
    erroredMiddleware: SessionUpdateMiddleware<Types>,
    error: Error,
    session: Parameters<SessionUpdateMiddleware<Types>['check']>[0],
    ...args: Tail<Parameters<SessionUpdateMiddleware<Types>['check']>>
  ): Error {
    const [interaction, meta] = args;

    return new SessionUpdateMiddlewareError<Types>(
      error,
      erroredMiddleware,
      session,
      interaction,
      meta,
    );
  }
}
