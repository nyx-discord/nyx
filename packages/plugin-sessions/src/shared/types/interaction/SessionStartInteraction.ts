import type {
  ApplicationCommandInteraction,
  InteractionTypes,
} from '@nyx-discord/types';

/** An interaction that triggers a {@link Session} start. */
export type SessionStartInteraction<
  Types extends InteractionTypes = InteractionTypes,
> =
  | ApplicationCommandInteraction<Types>
  | Types['SelectMenuInteraction']
  | Types['ButtonInteraction']
  | Types['ModalSubmitInteraction'];
