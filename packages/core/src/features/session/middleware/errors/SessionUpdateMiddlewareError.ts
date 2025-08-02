import { MetaCollection } from '../../../../meta/MetaCollection.js';
import { SessionUpdateError } from '../../errors/SessionUpdateError.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionUpdateMiddleware } from '../SessionUpdateMiddleware.js';

export class SessionUpdateMiddlewareError extends SessionUpdateError {
  protected readonly middleware: SessionUpdateMiddleware;

  constructor(
    error: Error,
    middleware: SessionUpdateMiddleware,
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: MetaCollection,
  ) {
    super(error, session, interaction, meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): SessionUpdateMiddleware {
    return this.middleware;
  }
}
