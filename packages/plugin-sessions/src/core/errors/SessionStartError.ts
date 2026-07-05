import type { Metadata } from '@nyx-discord/framework';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction';
import type { Session } from '../session/Session';
import { AbstractSessionError } from './AbstractSessionError';

/** An Error that wraps errors that occur during the start of a Session object. */
export class SessionStartError extends AbstractSessionError<SessionStartInteraction> {
  constructor(error: Error, session: Session<unknown>, meta: Metadata) {
    super(error, session, session.getStartInteraction(), meta);
  }
}
