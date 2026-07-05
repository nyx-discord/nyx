import { AbstractMiddleware } from '@nyx-discord/framework';
import type { SessionUpdateArgs } from '../../core/execution/args/SessionUpdateArgs';
import type { SessionUpdateMiddleware } from '../../core/middleware/update/SessionUpdateMiddleware';
import type { Session } from '../../core/session/Session';

export abstract class AbstractSessionUpdateMiddleware
  extends AbstractMiddleware<Session<unknown>, SessionUpdateArgs>
  implements SessionUpdateMiddleware {}
