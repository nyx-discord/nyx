import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionStartInteraction } from './SessionStartInteraction.js';
import type { SessionUpdateInteraction } from './SessionUpdateInteraction.js';

/** Any interaction that may trigger a session start or update. */
export type AnySessionInteraction<
  Types extends InteractionTypes = InteractionTypes,
> = SessionStartInteraction<Types> | SessionUpdateInteraction<Types>;
