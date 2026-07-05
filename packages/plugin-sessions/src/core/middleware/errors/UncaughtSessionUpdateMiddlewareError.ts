import type { Metadata, MiddlewareList } from '@nyx-discord/framework';
import { SessionUpdateError } from '../../errors/SessionUpdateError';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction';
import type { Session } from '../../session/Session';
import type { SessionUpdateMiddlewareResolvable } from '../update/SessionUpdateMiddlewareResolvable';

export class UncaughtSessionUpdateMiddlewareError extends SessionUpdateError {
  protected readonly middlewareList: MiddlewareList<SessionUpdateMiddlewareResolvable>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionUpdateMiddlewareResolvable>,
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: Metadata,
  ) {
    super(error, session, interaction, meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<SessionUpdateMiddlewareResolvable> {
    return this.middlewareList;
  }
}
