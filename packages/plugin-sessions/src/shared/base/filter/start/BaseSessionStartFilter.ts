import type { InteractionTypes } from '@nyx-discord/types';
import { AbstractFilter } from '@nyx-discord/base';
import type { SessionStartArgs } from '../../../types/execution/args/SessionStartArgs.js';
import type { SessionStartFilter } from '../../../types/filter/start/SessionStartFilter.js';
import type { Session } from '../../../types/session/Session.js';

/** Base {@link AbstractFilter Filter} for filtering session starts. */
export abstract class BaseSessionStartFilter<
  Result,
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractFilter<Session<Result, Types>, SessionStartArgs>
  implements SessionStartFilter<Result, Types> {}
