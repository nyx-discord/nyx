import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionUpdateFilterResolvable } from '../../../shared/types/filter/update/SessionUpdateFilterResolvable.js';

export type DjsSessionUpdateFilterResolvable<Result = void> =
  SessionUpdateFilterResolvable<Result, DjsInteractionTypes>;
