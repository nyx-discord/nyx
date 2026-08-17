import type { InteractionTypes } from '@nyx-discord/types';
import { AbstractMiddleware } from '@nyx-discord/base';
import type { SessionStartArgs } from '../../execution/args/SessionStartArgs.js';
import type { SessionStartMiddleware } from '../../middleware/start/SessionStartMiddleware.js';
import type { Session } from '../../session/Session.js';

/** Base {@link AbstractMiddleware Middleware} for session starts. */
export abstract class BaseSessionStartMiddleware<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractMiddleware<Session<unknown, Types>, SessionStartArgs>
  implements SessionStartMiddleware<Types> {}
