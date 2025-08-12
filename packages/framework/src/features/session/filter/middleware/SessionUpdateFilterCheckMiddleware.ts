import type {
  Session,
  SessionFilterResolvable,
  SessionUpdateArgs as Args,
} from '@nyx-discord/core';
import { AbstractSessionFilterCheckMiddleware } from './AbstractSessionFilterCheckMiddleware.js';

export class SessionUpdateFilterCheckMiddleware extends AbstractSessionFilterCheckMiddleware<Args> {
  /** @inheritDoc */
  protected extractFilter(
    session: Session<unknown>,
  ): SessionFilterResolvable<unknown, Args> | null {
    return session.getUpdateFilter();
  }
}
