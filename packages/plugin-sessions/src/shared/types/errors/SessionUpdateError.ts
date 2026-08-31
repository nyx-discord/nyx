import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction';
import { BaseSessionError } from './BaseSessionError';

/** An Error that wraps errors that occur during the update of a Session object. */
export class SessionUpdateError<
  Types extends InteractionTypes = InteractionTypes,
> extends BaseSessionError<SessionUpdateInteraction<Types>, Types> {}
