import type { InteractionTypes } from '@nyx-discord/types';
import type {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

/** The discord.js implementation of {@link InteractionTypes}. */
export interface DjsInteractionTypes extends InteractionTypes {
  readonly ChatInputInteraction: ChatInputCommandInteraction;
  readonly ContextMenuInteraction: ContextMenuCommandInteraction;
  readonly MessageContextMenuInteraction: MessageContextMenuCommandInteraction;
  readonly UserContextMenuInteraction: UserContextMenuCommandInteraction;
  readonly AutocompleteInteraction: AutocompleteInteraction;
  readonly ButtonInteraction: ButtonInteraction;
  readonly SelectMenuInteraction: AnySelectMenuInteraction;
  readonly ModalSubmitInteraction: ModalSubmitInteraction;
}
