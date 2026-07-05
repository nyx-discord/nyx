import type { SessionUpdateArgs } from '../../../core/execution/args/SessionUpdateArgs';
import type { SessionFilterResolvable } from '../../../core/filter/SessionFilterResolvable';
import type { Session } from '../../../core/session/Session';
import { AbstractSessionFilterCheckMiddleware } from './AbstractSessionFilterCheckMiddleware';

// eslint-disable-next-line max-len
export class SessionUpdateFilterCheckMiddleware extends AbstractSessionFilterCheckMiddleware<SessionUpdateArgs> {
  /** @inheritDoc */
  protected extractFilter(
    session: Session<unknown>,
  ): SessionFilterResolvable<unknown, SessionUpdateArgs> | null {
    return session.getUpdateFilter();
  }
}
