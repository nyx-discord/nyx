import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { BaseSessionUpdateFilter } from '../../../shared/base/filter/update/BaseSessionUpdateFilter.js';

export abstract class AbstractSessionUpdateFilter<
  Result = void,
> extends BaseSessionUpdateFilter<Result, DjsInteractionTypes> {}
