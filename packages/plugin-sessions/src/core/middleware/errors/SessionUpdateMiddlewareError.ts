import type { Metadata } from '@nyx-discord/framework';
import { SessionUpdateError } from '../../errors/SessionUpdateError';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction';
import type { Session } from '../../session/Session';
import type { SessionUpdateMiddleware } from '../update/SessionUpdateMiddleware';

export class SessionUpdateMiddlewareError extends SessionUpdateError {
  protected readonly middleware: SessionUpdateMiddleware;

  constructor(
    error: Error,
    middleware: SessionUpdateMiddleware,
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: Metadata,
  ) {
    super(error, session, interaction, meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): SessionUpdateMiddleware {
    return this.middleware;
  }
}
