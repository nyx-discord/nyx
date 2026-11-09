import type {
  ApplicationCommandInteraction,
  InteractionTypes,
} from '@nyx-discord/base';

/** An interaction that triggers a {@link Session} start. */
export type SessionStartInteraction<
  Types extends InteractionTypes = InteractionTypes,
> =
  | ApplicationCommandInteraction<Types>
  | Types['SelectMenuInteraction']
  | Types['ButtonInteraction']
  | Types['ModalSubmitInteraction'];
