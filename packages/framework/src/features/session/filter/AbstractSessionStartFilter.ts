import type {
  Session,
  SessionStartArgs,
  SessionStartFilter,
} from '@nyx-discord/core';

import { AbstractFilter } from '../../../filter/AbstractFilter.js';

export abstract class AbstractSessionStartFilter<Result>
  extends AbstractFilter<Session<Result>, SessionStartArgs>
  implements SessionStartFilter<Result> {}
