import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import { AbstractSessionError } from '../../errors/AbstractSessionError.js';
import type { SessionExecutionMeta } from '../../execution/meta/SessionExecutionMeta.js';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionStartMiddleware } from '../SessionStartMiddleware.js';

// eslint-disable-next-line max-len
export class UncaughtSessionStartMiddlewareError extends AbstractSessionError<SessionStartInteraction> {
  protected readonly middlewareList: MiddlewareList<SessionStartMiddleware>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionStartMiddleware>,
    session: Session<unknown>,
    meta: SessionExecutionMeta,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<SessionStartMiddleware> {
    return this.middlewareList;
  }
}
