import type { Metadata } from '@nyx-discord/framework';
import { AbstractSessionError } from '../../errors/AbstractSessionError';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction';
import type { Session } from '../../session/Session';
import type { SessionStartMiddleware } from '../start/SessionStartMiddleware';

export class SessionStartMiddlewareError extends AbstractSessionError<SessionStartInteraction> {
  protected readonly middleware: SessionStartMiddleware;

  constructor(
    error: Error,
    middleware: SessionStartMiddleware,
    session: Session<unknown>,
    meta: Metadata,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): SessionStartMiddleware {
    return this.middleware;
  }
}
