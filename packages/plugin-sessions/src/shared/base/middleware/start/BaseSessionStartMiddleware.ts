import type { InteractionTypes } from '@nyx-discord/types';
import { AbstractMiddleware } from '@nyx-discord/base';
import type { SessionStartArgs } from '../../../types/execution/args/SessionStartArgs.js';
import type { SessionStartMiddleware } from '../../../types/middleware/start/SessionStartMiddleware.js';
import type { Session } from '../../../types/session/Session.js';

/** Base {@link AbstractMiddleware Middleware} for session starts. */
export abstract class BaseSessionStartMiddleware<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractMiddleware<Session<unknown, Types>, SessionStartArgs>
  implements SessionStartMiddleware<Types> {}
