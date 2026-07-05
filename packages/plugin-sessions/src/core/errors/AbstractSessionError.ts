import type { Metadata } from '@nyx-discord/framework';
import { FeatureError } from '@nyx-discord/framework';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction';
import type { Session } from '../session/Session';

/** An Error that wraps errors that occur during the execution of a Session object. */
export abstract class AbstractSessionError<
  SessionInteraction extends
    | SessionStartInteraction
    | SessionUpdateInteraction
    | null,
> extends FeatureError<Session<unknown>> {
  protected readonly interaction: SessionInteraction;

  protected readonly meta: Metadata;

  constructor(
    error: Error,
    session: Session<unknown>,
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
