import { AbstractFilter } from '@nyx-discord/framework';
import type { SessionUpdateArgs } from '../../core/execution/args/SessionUpdateArgs';
import type { SessionUpdateFilter } from '../../core/filter/update/SessionUpdateFilter';
import type { Session } from '../../core/session/Session';

export abstract class AbstractSessionUpdateFilter<Result>
  extends AbstractFilter<Session<Result>, SessionUpdateArgs>
  implements SessionUpdateFilter<Result> {}
