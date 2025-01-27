import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import { SessionUpdateError } from '../../errors/SessionUpdateError.js';
import type { SessionExecutionMeta } from '../../execution/meta/SessionExecutionMeta.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionUpdateMiddleware } from '../SessionUpdateMiddleware.js';

export class UncaughtSessionUpdateMiddlewareError extends SessionUpdateError {
  protected readonly middlewareList: MiddlewareList<SessionUpdateMiddleware>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionUpdateMiddleware>,
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: SessionExecutionMeta,
  ) {
    super(error, session, interaction, meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<SessionUpdateMiddleware> {
    return this.middlewareList;
  }
}
