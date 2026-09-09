import type {
  ApplicationCommandInteraction,
  ComponentCommandInteraction,
} from '@nyx-discord/types';
import type {
  AutocompleteInteraction,
  ButtonInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { vi } from 'vitest';
import type { DjsInteractionTypes } from '../../../src/types/DjsInteractionTypes.js';

export class StubInteraction {
  public static createChatInput(
    commandName = 'mock-chat-input',
    subcommandGroup?: string | null,
    subcommand?: string | null,
  ): ApplicationCommandInteraction<DjsInteractionTypes> {
    return {
      commandName,
      isChatInputCommand: vi.fn().mockReturnValue(true),
      isAutocomplete: vi.fn().mockReturnValue(false),
      isMessageComponent: vi.fn().mockReturnValue(false),
      isModalSubmit: vi.fn().mockReturnValue(false),
      isUserContextMenuCommand: vi.fn().mockReturnValue(false),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
      options: {
        getSubcommandGroup: vi.fn().mockReturnValue(subcommandGroup ?? null),
        getSubcommand: vi.fn().mockReturnValue(subcommand ?? null),
      },
    } as unknown as ApplicationCommandInteraction<DjsInteractionTypes>;
  }

  public static createContextMenu(
    commandName = 'mock-context-menu',
  ): ApplicationCommandInteraction<DjsInteractionTypes> {
    return {
      commandName,
      isChatInputCommand: vi.fn().mockReturnValue(false),
      isAutocomplete: vi.fn().mockReturnValue(false),
      isMessageComponent: vi.fn().mockReturnValue(false),
      isModalSubmit: vi.fn().mockReturnValue(false),
      isUserContextMenuCommand: vi.fn().mockReturnValue(false),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
    } as unknown as ApplicationCommandInteraction<DjsInteractionTypes>;
  }

  public static createUserContextMenu(
    commandName = 'mock-user-context-menu',
  ): UserContextMenuCommandInteraction {
    return {
      commandName,
      isChatInputCommand: vi.fn().mockReturnValue(false),
      isAutocomplete: vi.fn().mockReturnValue(false),
      isMessageComponent: vi.fn().mockReturnValue(false),
      isModalSubmit: vi.fn().mockReturnValue(false),
      isUserContextMenuCommand: vi.fn().mockReturnValue(true),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
    } as unknown as UserContextMenuCommandInteraction;
  }

  public static createMessageContextMenu(
    commandName = 'mock-message-context-menu',
  ): MessageContextMenuCommandInteraction {
    return {
      commandName,
      isChatInputCommand: vi.fn().mockReturnValue(false),
      isAutocomplete: vi.fn().mockReturnValue(false),
      isMessageComponent: vi.fn().mockReturnValue(false),
      isModalSubmit: vi.fn().mockReturnValue(false),
      isUserContextMenuCommand: vi.fn().mockReturnValue(false),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(true),
    } as unknown as MessageContextMenuCommandInteraction;
  }

  public static createButton(
    customId = 'btn-id',
  ): ButtonInteraction {
    return {
      customId,
      isChatInputCommand: vi.fn().mockReturnValue(false),
      isAutocomplete: vi.fn().mockReturnValue(false),
      isMessageComponent: vi.fn().mockReturnValue(true),
      isModalSubmit: vi.fn().mockReturnValue(false),
      isUserContextMenuCommand: vi.fn().mockReturnValue(false),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
      isButton: vi.fn().mockReturnValue(true),
    } as unknown as ButtonInteraction;
  }

  public static createModalSubmit(
    customId = 'modal-id',
  ): ModalSubmitInteraction {
    return {
      customId,
      isChatInputCommand: vi.fn().mockReturnValue(false),
      isAutocomplete: vi.fn().mockReturnValue(false),
      isMessageComponent: vi.fn().mockReturnValue(false),
      isModalSubmit: vi.fn().mockReturnValue(true),
      isUserContextMenuCommand: vi.fn().mockReturnValue(false),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
    } as unknown as ModalSubmitInteraction;
  }

  public static createAutocomplete(
    commandName = 'mock-autocomplete',
    subcommandGroup?: string | null,
    subcommand?: string | null,
  ): AutocompleteInteraction {
    return {
      commandName,
      isChatInputCommand: vi.fn().mockReturnValue(false),
      isAutocomplete: vi.fn().mockReturnValue(true),
      isMessageComponent: vi.fn().mockReturnValue(false),
      isModalSubmit: vi.fn().mockReturnValue(false),
      isUserContextMenuCommand: vi.fn().mockReturnValue(false),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
      options: {
        getSubcommandGroup: vi.fn().mockReturnValue(subcommandGroup ?? null),
        getSubcommand: vi.fn().mockReturnValue(subcommand ?? null),
      },
    } as unknown as AutocompleteInteraction;
  }

  public static createUnknown(): ComponentCommandInteraction<DjsInteractionTypes> {
    return {
      isChatInputCommand: vi.fn().mockReturnValue(false),
      isAutocomplete: vi.fn().mockReturnValue(false),
      isMessageComponent: vi.fn().mockReturnValue(false),
      isModalSubmit: vi.fn().mockReturnValue(false),
      isUserContextMenuCommand: vi.fn().mockReturnValue(false),
      isMessageContextMenuCommand: vi.fn().mockReturnValue(false),
    } as unknown as ComponentCommandInteraction<DjsInteractionTypes>;
  }
}
