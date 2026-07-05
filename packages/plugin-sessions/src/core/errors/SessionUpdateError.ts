import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction';
import { AbstractSessionError } from './AbstractSessionError';

/** An Error that wraps errors that occur during the update of a Session object. */
export class SessionUpdateError extends AbstractSessionError<SessionUpdateInteraction> {}
