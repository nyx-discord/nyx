import type {
  InteractionTypes,
  Metadata,
  MiddlewareList,
} from '@nyx-discord/types';
import { SessionUpdateError } from '../../errors/SessionUpdateError.js';
import type { SessionUpdateInteraction } from '../../interaction/SessionUpdateInteraction.js';
import type { Session } from '../../session/Session.js';
import type { SessionUpdateMiddlewareResolvable } from '../update/SessionUpdateMiddlewareResolvable.js';

export class UncaughtSessionUpdateMiddlewareError<
  Types extends InteractionTypes = InteractionTypes,
> extends SessionUpdateError<Types> {
  protected readonly middlewareList: MiddlewareList<
    SessionUpdateMiddlewareResolvable<Types>
  >;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<SessionUpdateMiddlewareResolvable<Types>>,
    session: Session<unknown, Types>,
    interaction: SessionUpdateInteraction<Types>,
    meta: Metadata,
  ) {
    super(error, session, interaction, meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getMiddlewareList(): MiddlewareList<
    SessionUpdateMiddlewareResolvable<Types>
  > {
    return this.middlewareList;
  }
}
