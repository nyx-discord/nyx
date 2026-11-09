import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { SessionStartFilterResolvable } from '../../../shared/types/filter/start/SessionStartFilterResolvable.js';

export type CoreSessionStartFilterResolvable<Result = void> =
  SessionStartFilterResolvable<Result, CoreInteractionTypes>;
