import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import { BaseSessionUpdateFilter } from '../../../shared/base/filter/update/BaseSessionUpdateFilter.js';

export abstract class AbstractSessionUpdateFilter<
  Result = void,
> extends BaseSessionUpdateFilter<Result, CoreInteractionTypes> {}
