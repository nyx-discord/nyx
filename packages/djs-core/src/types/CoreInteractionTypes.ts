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
import type { CoreInteractionContext } from './CoreInteractionContext.js';

/** The @discordjs/core implementation of {@link InteractionTypes}. */
export interface CoreInteractionTypes extends InteractionTypes {
  readonly ChatInputInteraction: CoreInteractionContext<APIChatInputApplicationCommandInteraction>;
  readonly ContextMenuInteraction: CoreInteractionContext<APIContextMenuInteraction>;
  readonly MessageContextMenuInteraction: CoreInteractionContext<APIMessageApplicationCommandInteraction>;
  readonly UserContextMenuInteraction: CoreInteractionContext<APIUserApplicationCommandInteraction>;
  readonly AutocompleteInteraction: CoreInteractionContext<APIApplicationCommandAutocompleteInteraction>;
  readonly ButtonInteraction: CoreInteractionContext<APIMessageComponentButtonInteraction>;
  readonly SelectMenuInteraction: CoreInteractionContext<APIMessageComponentSelectMenuInteraction>;
  readonly ModalSubmitInteraction: CoreInteractionContext<APIModalSubmitInteraction>;
}
