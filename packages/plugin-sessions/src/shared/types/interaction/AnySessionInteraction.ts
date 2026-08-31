import type { InteractionTypes } from '@nyx-discord/types';
import type { SessionUpdateInteraction } from './SessionUpdateInteraction';
import type { SessionStartInteraction } from './SessionStartInteraction';

/** Any interaction that may trigger a session start or update. */
export type AnySessionInteraction<
  Types extends InteractionTypes = InteractionTypes,
> = SessionStartInteraction<Types> | SessionUpdateInteraction<Types>;
