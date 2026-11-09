import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { BaseSessionStartFilter } from '../../../shared/base/filter/start/BaseSessionStartFilter.js';

export abstract class AbstractSessionStartFilter<
  Result = void,
> extends BaseSessionStartFilter<Result, DjsInteractionTypes> {}
