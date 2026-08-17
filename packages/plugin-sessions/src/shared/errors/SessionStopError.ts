import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionEndData } from '../end/SessionEndData.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { Session } from '../session/Session.js';
import { AbstractSessionError } from './AbstractSessionError.js';

export class SessionStopError<
  Types extends InteractionTypes = InteractionTypes,
  Data extends SessionEndData<unknown> = SessionEndData<unknown>,
> extends AbstractSessionError<SessionUpdateInteraction<Types> | null, Types> {
  protected readonly data: Data;

  constructor(
    error: Error,
    session: Session<unknown, Types>,
    data: Data,
    interaction: SessionUpdateInteraction<Types> | null,
    meta: Metadata,
  ) {
    super(error, session, interaction, meta);

    this.data = data;
  }

  /** Returns the data about this session's stop. */
  public getData(): Data {
    return this.data;
  }
}
