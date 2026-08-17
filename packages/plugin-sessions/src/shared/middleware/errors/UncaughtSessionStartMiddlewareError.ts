import type {
  InteractionTypes,
  Metadata,
  MiddlewareList,
} from '@nyx-discord/types';
import { AbstractSessionError } from '../../errors/AbstractSessionError.js';
import type { SessionStartInteraction } from '../../interaction/SessionStartInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionStartMiddlewareResolvable } from '../start/SessionStartMiddlewareResolvable.js';

export class UncaughtSessionStartMiddlewareError<
  Types extends InteractionTypes = InteractionTypes,
> extends AbstractSessionError<SessionStartInteraction<Types>, Types> {
  protected readonly middlewareList: MiddlewareList<
    SessionStartMiddlewareResolvable<Types>
  >;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionStartMiddlewareResolvable<Types>>,
    session: Session<unknown, Types>,
    meta: Metadata,
  ) {
    super(error, session, session.getStartInteraction(), meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<
    SessionStartMiddlewareResolvable<Types>
  > {
    return this.middlewareList;
  }
}
