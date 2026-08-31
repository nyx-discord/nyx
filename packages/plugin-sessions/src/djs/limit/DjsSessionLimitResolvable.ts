import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionLimitResolvable } from '../../shared/types/limit/limit/SessionLimitResolvable.js';

export type DjsSessionLimitResolvable =
  SessionLimitResolvable<DjsInteractionTypes>;
