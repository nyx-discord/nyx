import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionStartFilterResolvable } from '../../../shared/types/filter/start/SessionStartFilterResolvable.js';

export type DjsSessionStartFilterResolvable<Result = void> =
  SessionStartFilterResolvable<Result, DjsInteractionTypes>;
