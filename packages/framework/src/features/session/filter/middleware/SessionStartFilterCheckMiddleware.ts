import type {
  Session,
  SessionFilterResolvable,
  SessionStartArgs as Args,
} from '@nyx-discord/core';
import { AbstractSessionFilterCheckMiddleware } from './AbstractSessionFilterCheckMiddleware.js';

export class SessionStartFilterCheckMiddleware extends AbstractSessionFilterCheckMiddleware<Args> {
  /** @inheritDoc */
  protected extractFilter(
    session: Session<unknown>,
  ): SessionFilterResolvable<unknown, Args> | null {
    return session.getStartFilter();
  }
}
