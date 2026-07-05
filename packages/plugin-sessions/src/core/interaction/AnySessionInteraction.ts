import type { SessionStartInteraction } from './SessionStartInteraction';
import type { SessionUpdateInteraction } from './SessionUpdateInteraction';

export type AnySessionInteraction =
  | SessionStartInteraction
  | SessionUpdateInteraction;
