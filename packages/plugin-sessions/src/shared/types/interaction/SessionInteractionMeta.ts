import type { InteractionType } from 'discord-api-types/v10';

/** Metadata about an interaction, used to enrich a session's {@link Metadata}. */
export interface SessionInteractionMeta {
  /** The ID of the interaction. */
  id: string;
  /** The type of the interaction. */
  type: InteractionType;
}
