import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import { AbstractSessionError } from '../../errors/AbstractSessionError.js';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionStartMiddleware } from '../start/SessionStartMiddleware.js';

export class SessionStartMiddlewareError<
  Types extends InteractionTypes = InteractionTypes,
> extends AbstractSessionError<SessionStartInteraction<Types>, Types> {
  protected readonly middleware: SessionStartMiddleware<Types>;

  constructor(
    error: Error,
    middleware: SessionStartMiddleware<Types>,
    session: Session<unknown, Types>,
    meta: Metadata,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): SessionStartMiddleware<Types> {
    return this.middleware;
  }
}
