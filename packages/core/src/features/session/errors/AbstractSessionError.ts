import { FeatureError } from '../../../errors/FeatureError.js';
import type { SessionExecutionMeta } from '../execution/meta/SessionExecutionMeta.js';
import type { SessionStartInteraction } from '../interaction/SessionStartInteraction.js';
import type { SessionUpdateInteraction } from '../interaction/SessionUpdateInteraction.js';
import type { Session } from '../session/Session.js';

/** An Error that wraps errors that occur during the execution of a Session object. */
export abstract class AbstractSessionError<
  SessionInteraction extends
    | SessionStartInteraction
    | SessionUpdateInteraction
    | null,
> extends FeatureError<Session<unknown>> {
  protected readonly interaction: SessionInteraction;

  protected readonly meta: SessionExecutionMeta;

  constructor(
    error: Error,
    session: Session<unknown>,
    interaction: SessionInteraction,
    meta: SessionExecutionMeta,
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
