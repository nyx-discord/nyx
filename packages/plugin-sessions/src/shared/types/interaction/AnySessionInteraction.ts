import type { InteractionTypes } from '@nyx-discord/base';
import type { SessionStartInteraction } from './SessionStartInteraction';
import type { SessionUpdateInteraction } from './SessionUpdateInteraction';

/** Any interaction that may trigger a session start or update. */
export type AnySessionInteraction<
  Types extends InteractionTypes = InteractionTypes,
> = SessionStartInteraction<Types> | SessionUpdateInteraction<Types>;
