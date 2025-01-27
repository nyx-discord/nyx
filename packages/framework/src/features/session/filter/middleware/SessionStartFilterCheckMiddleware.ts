import type {
  SessionStartArgs as Args,
  Session,
  SessionFilter,
} from '@nyx-discord/core';

import { AbstractSessionFilterCheckMiddleware } from './AbstractSessionFilterCheckMiddleware.js';

export class SessionStartFilterCheckMiddleware extends AbstractSessionFilterCheckMiddleware<Args> {
  /** @inheritDoc */
  protected extractFilter(
    session: Session<unknown>,
  ): SessionFilter<unknown, Args> | null {
    return session.getStartFilter();
  }
}
