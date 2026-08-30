import type { ToEventProps } from '@discordjs/core';
import type { InteractionTypes } from '@nyx-discord/types';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIContextMenuInteraction,
  APIMessageApplicationCommandInteraction,
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalSubmitInteraction,
  APIUserApplicationCommandInteraction,
} from 'discord-api-types/v10';

/** The @discordjs/core implementation of {@link InteractionTypes}. */
export interface CoreInteractionTypes extends InteractionTypes {
  readonly ChatInputInteraction: ToEventProps<APIChatInputApplicationCommandInteraction>;
  readonly ContextMenuInteraction: ToEventProps<APIContextMenuInteraction>;
  readonly MessageContextMenuInteraction: ToEventProps<APIMessageApplicationCommandInteraction>;
  readonly UserContextMenuInteraction: ToEventProps<APIUserApplicationCommandInteraction>;
  readonly AutocompleteInteraction: ToEventProps<APIApplicationCommandAutocompleteInteraction>;
  readonly ButtonInteraction: ToEventProps<APIMessageComponentButtonInteraction>;
  readonly SelectMenuInteraction: ToEventProps<APIMessageComponentSelectMenuInteraction>;
  readonly ModalSubmitInteraction: ToEventProps<APIModalSubmitInteraction>;
}
