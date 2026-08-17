import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import { SessionUpdateError } from '../../errors/SessionUpdateError.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionUpdateMiddleware } from '../update/SessionUpdateMiddleware.js';

export class SessionUpdateMiddlewareError<
  Types extends InteractionTypes = InteractionTypes,
> extends SessionUpdateError<Types> {
  protected readonly middleware: SessionUpdateMiddleware<Types>;

  constructor(
    error: Error,
    middleware: SessionUpdateMiddleware<Types>,
    session: Session<unknown, Types>,
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ) {
    super(error, session, interaction, meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): SessionUpdateMiddleware<Types> {
    return this.middleware;
  }
}
