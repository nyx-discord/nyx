import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import { BaseSessionStartFilter } from '../../../shared/base/filter/start/BaseSessionStartFilter.js';

export abstract class AbstractSessionStartFilter<
  Result = void,
> extends BaseSessionStartFilter<Result, CoreInteractionTypes> {}
