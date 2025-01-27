import { AbstractSessionError } from '../../errors/AbstractSessionError.js';
import type { SessionExecutionMeta } from '../../execution/meta/SessionExecutionMeta.js';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionStartMiddleware } from '../SessionStartMiddleware.js';

export class SessionStartMiddlewareError extends AbstractSessionError<SessionStartInteraction> {
  protected readonly middleware: SessionStartMiddleware;

  constructor(
    error: Error,
    middleware: SessionStartMiddleware,
    session: Session<unknown>,
    meta: SessionExecutionMeta,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): SessionStartMiddleware {
    return this.middleware;
  }
}
