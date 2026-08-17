import type { InteractionTypes } from '@nyx-discord/types';

/** An interaction that triggers a {@link Session} update. */
export type SessionUpdateInteraction<
  Types extends InteractionTypes = InteractionTypes,
> =
  | Types['ButtonInteraction']
  | Types['SelectMenuInteraction']
  | Types['ModalSubmitInteraction'];
