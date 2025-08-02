import { MetaCollection } from '../../../meta/MetaCollection.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { Session } from '../session/Session.js';
import { AbstractSessionError } from './AbstractSessionError.js';

/** An Error that wraps errors that occur during the start of a Session object. */
export class SessionStartError extends AbstractSessionError<SessionStartInteraction> {
  constructor(error: Error, session: Session<unknown>, meta: MetaCollection) {
    super(error, session, session.getStartInteraction(), meta);
  }
}
