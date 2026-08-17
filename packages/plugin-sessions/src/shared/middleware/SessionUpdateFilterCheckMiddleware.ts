import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionUpdateArgs } from '../execution/args/SessionUpdateArgs.js';
import type { SessionFilterResolvable } from '../filter/SessionFilterResolvable.js';
import type { Session } from '../session/Session.js';
import { BaseSessionFilterCheckMiddleware } from './BaseSessionFilterCheckMiddleware.js';

/** Checks the {@link Session#getUpdateFilter update filter} of a session before it updates. */
export class SessionUpdateFilterCheckMiddleware<
  Types extends InteractionTypes = InteractionTypes,
> extends BaseSessionFilterCheckMiddleware<Types, SessionUpdateArgs<Types>> {
  protected override extractFilter(
    session: Session<unknown, Types>,
  ): SessionFilterResolvable<unknown, SessionUpdateArgs<Types>, Types> | null {
    return session.getUpdateFilter();
  }
}
