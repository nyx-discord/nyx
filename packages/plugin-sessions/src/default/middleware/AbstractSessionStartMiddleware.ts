import { AbstractMiddleware } from '@nyx-discord/framework';
import type { SessionStartArgs } from '../../core/execution/args/SessionStartArgs';
import type { SessionStartMiddleware } from '../../core/middleware/start/SessionStartMiddleware';
import type { Session } from '../../core/session/Session';

export abstract class AbstractSessionStartMiddleware
  extends AbstractMiddleware<Session<unknown>, SessionStartArgs>
  implements SessionStartMiddleware {}
