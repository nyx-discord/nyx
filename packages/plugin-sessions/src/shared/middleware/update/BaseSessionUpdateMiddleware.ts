import type { InteractionTypes } from '@nyx-discord/types';
import { AbstractMiddleware } from '@nyx-discord/base';
import type { SessionUpdateArgs } from '../../execution/args/SessionUpdateArgs.js';
import type { SessionUpdateMiddleware } from '../../middleware/update/SessionUpdateMiddleware.js';
import type { Session } from '../../session/Session.js';

/** Base {@link AbstractMiddleware Middleware} for session updates. */
export abstract class BaseSessionUpdateMiddleware<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractMiddleware<Session<unknown, Types>, SessionUpdateArgs<Types>>
  implements SessionUpdateMiddleware<Types> {}
