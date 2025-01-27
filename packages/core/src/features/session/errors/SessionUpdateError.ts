import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import { AbstractSessionError } from './AbstractSessionError.js';

/** An Error that wraps errors that occur during the update of a Session object. */
export class SessionUpdateError extends AbstractSessionError<SessionUpdateInteraction> {}
