/**
 * A bundle of the concrete interaction types used by a Discord backend.
 *
 * The nyx command interfaces are generic over these types, so each adapter can
 * fill them with its own native interaction types. This lets discord.js users
 * work with `ChatInputCommandInteraction` while @discordjs/core users work with
 * their `{ data, api }` contexts, without the framework depending on either.
 */
export interface InteractionTypes {
  /** The interaction type for chat input (slash) commands. */
  readonly ChatInputInteraction: unknown;
  /** The interaction type for context menu commands. */
  readonly ContextMenuInteraction: unknown;
  /** The interaction type for autocomplete requests. */
  readonly AutocompleteInteraction: unknown;
  /** The interaction type for button components. */
  readonly ButtonInteraction: unknown;
  /** The interaction type for select menu components. */
  readonly SelectMenuInteraction: unknown;
  /** The interaction type for modal submissions. */
  readonly ModalSubmitInteraction: unknown;
}
