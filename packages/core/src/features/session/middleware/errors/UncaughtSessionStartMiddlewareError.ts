import type { MetaCollection } from '../../../../meta/MetaCollection';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import { AbstractSessionError } from '../../errors/AbstractSessionError.js';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionStartMiddlewareResolvable } from '../start/SessionStartMiddlewareResolvable';

// eslint-disable-next-line max-len
export class UncaughtSessionStartMiddlewareError extends AbstractSessionError<SessionStartInteraction> {
  protected readonly middlewareList: MiddlewareList<SessionStartMiddlewareResolvable>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionStartMiddlewareResolvable>,
    session: Session<unknown>,
    meta: MetaCollection,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<SessionStartMiddlewareResolvable> {
    return this.middlewareList;
  }
}
