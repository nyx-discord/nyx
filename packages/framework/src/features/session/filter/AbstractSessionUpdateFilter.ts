import type {
  Session,
  SessionUpdateArgs,
  SessionUpdateFilter,
} from '@nyx-discord/core';

import { AbstractFilter } from '../../../filter/AbstractFilter.js';

export abstract class AbstractSessionUpdateFilter<Result>
  extends AbstractFilter<Session<Result>, SessionUpdateArgs>
  implements SessionUpdateFilter<Result> {}
