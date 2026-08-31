import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionUpdateInteraction } from '../../shared/types/interaction/SessionUpdateInteraction.js';

export type DjsSessionUpdateInteraction =
  SessionUpdateInteraction<DjsInteractionTypes>;
