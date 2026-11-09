import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionStartInteraction } from '../../shared/types/interaction/SessionStartInteraction.js';

export type DjsSessionStartInteraction =
  SessionStartInteraction<DjsInteractionTypes>;
