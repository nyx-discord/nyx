/** A bundle of the concrete interaction types used by a Discord backend. */
export interface InteractionTypes {
  /** The interaction type for chat input (slash) commands. */
  readonly ChatInputInteraction: unknown;
  /** The interaction type for context menu commands. */
  readonly ContextMenuInteraction: unknown;
  /** The interaction type for message context menu commands. */
  readonly MessageContextMenuInteraction: unknown;
  /** The interaction type for user context menu commands. */
  readonly UserContextMenuInteraction: unknown;
  /** The interaction type for autocomplete requests. */
  readonly AutocompleteInteraction: unknown;
  /** The interaction type for button components. */
  readonly ButtonInteraction: unknown;
  /** The interaction type for select menu components. */
  readonly SelectMenuInteraction: unknown;
  /** The interaction type for modal submissions. */
  readonly ModalSubmitInteraction: unknown;
}
