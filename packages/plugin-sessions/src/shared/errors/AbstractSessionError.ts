import type { InteractionTypes, Metadata } from '@nyx-discord/types';
import { FeatureError } from '@nyx-discord/types';
import type { Session } from '../session/Session.js';

/** An Error that wraps errors that occur during the execution of a Session object. */
export abstract class AbstractSessionError<
  SessionInteraction,
  Types extends InteractionTypes = InteractionTypes,
> extends FeatureError<Session<unknown, Types>> {
  protected readonly interaction: SessionInteraction;

  protected readonly meta: Metadata;

  constructor(
    error: Error,
    session: Session<unknown, Types>,
    interaction: SessionInteraction,
    meta: Metadata,
  ) {
    super(error, session, 'There was an error while executing a Session.');
    this.interaction = interaction;
    this.meta = meta;
  }

  /** Return the interaction that caused this error. */
  public getInteraction(): SessionInteraction {
    return this.interaction;
  }
}
