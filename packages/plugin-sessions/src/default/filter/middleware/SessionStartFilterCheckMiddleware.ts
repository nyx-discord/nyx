import type { SessionStartArgs } from '../../../core/execution/args/SessionStartArgs';
import type { SessionFilterResolvable } from '../../../core/filter/SessionFilterResolvable';
import type { Session } from '../../../core/session/Session';
import { AbstractSessionFilterCheckMiddleware } from './AbstractSessionFilterCheckMiddleware';

// eslint-disable-next-line max-len
export class SessionStartFilterCheckMiddleware extends AbstractSessionFilterCheckMiddleware<SessionStartArgs> {
  /** @inheritDoc */
  protected extractFilter(
    session: Session<unknown>,
  ): SessionFilterResolvable<unknown, SessionStartArgs> | null {
    return session.getStartFilter();
  }
}
