import type { CoreInteractionTypes } from '@nyx-discord/djs-core';
import type { SessionUpdateFilterResolvable } from '../../../shared/types/filter/update/SessionUpdateFilterResolvable.js';

export type CoreSessionUpdateFilterResolvable<Result = void> =
  SessionUpdateFilterResolvable<Result, CoreInteractionTypes>;
