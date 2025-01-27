import type { SessionStartInteraction } from './SessionStartInteraction.js';
import type { SessionUpdateInteraction } from './SessionUpdateInteraction.js';

export type AnySessionInteraction =
  | SessionStartInteraction
  | SessionUpdateInteraction;
