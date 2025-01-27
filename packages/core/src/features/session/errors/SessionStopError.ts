import type { SessionEndData } from '../end/SessionEndData';
import type { SessionExecutionMeta } from '../execution/meta/SessionExecutionMeta.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction';
import type { Session } from '../session/Session.js';
import { AbstractSessionError } from './AbstractSessionError.js';

export class SessionStopError<
  Data extends SessionEndData<unknown>,
> extends AbstractSessionError<SessionUpdateInteraction | null> {
  protected readonly data: Data;

  constructor(
    error: Error,
    session: Session<unknown>,
    data: Data,
    interaction: SessionUpdateInteraction | null,
    meta: SessionExecutionMeta,
  ) {
    super(error, session, interaction, meta);

    this.data = data;
  }

  /** Returns the data about this session's stop. */
  public getData(): Data {
    return this.data;
  }
}
