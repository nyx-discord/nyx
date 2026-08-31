import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction';
import type { Session } from '../session/Session.js';
import { BaseSessionError } from './BaseSessionError';

/** An Error that wraps errors that occur during the start of a Session object. */
export class SessionStartError<
  Types extends InteractionTypes = InteractionTypes,
> extends BaseSessionError<SessionStartInteraction<Types>, Types> {
  constructor(error: Error, session: Session<unknown, Types>, meta: Metadata) {
    super(error, session, session.getStartInteraction(), meta);
  }
}
