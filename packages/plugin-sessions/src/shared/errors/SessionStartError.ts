import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { Session } from '../session/Session.js';
import { AbstractSessionError } from './AbstractSessionError.js';

/** An Error that wraps errors that occur during the start of a Session object. */
export class SessionStartError<
  Types extends InteractionTypes = InteractionTypes,
> extends AbstractSessionError<SessionStartInteraction<Types>, Types> {
  constructor(error: Error, session: Session<unknown, Types>, meta: Metadata) {
    super(error, session, session.getStartInteraction(), meta);
  }
}
