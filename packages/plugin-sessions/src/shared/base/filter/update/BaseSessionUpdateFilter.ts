import type { InteractionTypes } from '@nyx-discord/types';
import { AbstractFilter } from '@nyx-discord/base';
import type { SessionUpdateArgs } from '../../../types/execution/args/SessionUpdateArgs.js';
import type { SessionUpdateFilter } from '../../../types/filter/update/SessionUpdateFilter.js';
import type { Session } from '../../../types/session/Session.js';

/** Base {@link AbstractFilter Filter} for filtering session updates. */
export abstract class BaseSessionUpdateFilter<
  Result,
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractFilter<Session<Result, Types>, SessionUpdateArgs<Types>>
  implements SessionUpdateFilter<Result, Types> {}
