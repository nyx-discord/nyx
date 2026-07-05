import type { Metadata, MiddlewareList } from '@nyx-discord/framework';
import { AbstractSessionError } from '../../errors/AbstractSessionError';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction';
import type { Session } from '../../session/Session';
import type { SessionStartMiddlewareResolvable } from '../start/SessionStartMiddlewareResolvable';

// eslint-disable-next-line max-len
export class UncaughtSessionStartMiddlewareError extends AbstractSessionError<SessionStartInteraction> {
  protected readonly middlewareList: MiddlewareList<SessionStartMiddlewareResolvable>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionStartMiddlewareResolvable>,
    session: Session<unknown>,
    meta: Metadata,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<SessionStartMiddlewareResolvable> {
    return this.middlewareList;
  }
}
