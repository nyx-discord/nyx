import type { MetaCollection } from '../../../../meta/MetaCollection';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import { SessionUpdateError } from '../../errors/SessionUpdateError.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionUpdateMiddlewareResolvable } from '../update/SessionUpdateMiddlewareResolvable';

export class UncaughtSessionUpdateMiddlewareError extends SessionUpdateError {
  protected readonly middlewareList: MiddlewareList<SessionUpdateMiddlewareResolvable>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionUpdateMiddlewareResolvable>,
    session: Session<unknown>,
    interaction: SessionUpdateInteraction,
    meta: MetaCollection,
  ) {
    super(error, session, interaction, meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<SessionUpdateMiddlewareResolvable> {
    return this.middlewareList;
  }
}
