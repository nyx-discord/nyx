import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionStartArgs } from '../execution/args/SessionStartArgs.js';
import type { SessionFilterResolvable } from '../filter/SessionFilterResolvable.js';
import type { Session } from '../session/Session.js';
import { BaseSessionFilterCheckMiddleware } from './BaseSessionFilterCheckMiddleware.js';

/** Checks the {@link Session#getStartFilter start filter} of a session before it starts. */
export class SessionStartFilterCheckMiddleware<
  Types extends InteractionTypes = InteractionTypes,
> extends BaseSessionFilterCheckMiddleware<Types, SessionStartArgs> {
  protected override extractFilter(
    session: Session<unknown, Types>,
  ): SessionFilterResolvable<unknown, SessionStartArgs, Types> | null {
    return session.getStartFilter();
  }
}
