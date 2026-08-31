import { AbstractMiddleware } from '@nyx-discord/base';
import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionUpdateArgs } from '../../../types/execution/args/SessionUpdateArgs.js';
import type { Session } from '../../../types/session/Session.js';

/** Base {@link AbstractMiddleware Middleware} for session updates. */
export abstract class BaseSessionUpdateMiddleware<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractMiddleware<Session<unknown, Types>, SessionUpdateArgs<Types>>
  implements BaseSessionUpdateMiddleware<Types> {}
