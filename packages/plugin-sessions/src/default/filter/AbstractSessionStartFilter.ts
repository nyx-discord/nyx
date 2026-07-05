import { AbstractFilter } from '@nyx-discord/framework';
import type { SessionStartArgs } from '../../core/execution/args/SessionStartArgs';
import type { SessionStartFilter } from '../../core/filter/start/SessionStartFilter';
import type { Session } from '../../core/session/Session';

export abstract class AbstractSessionStartFilter<Result>
  extends AbstractFilter<Session<Result>, SessionStartArgs>
  implements SessionStartFilter<Result> {}
