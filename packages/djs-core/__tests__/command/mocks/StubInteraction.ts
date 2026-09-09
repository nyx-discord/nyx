import type { ToEventProps } from '@discordjs/core';
import type {
  ApplicationCommandInteraction,
  ComponentCommandInteraction,
} from '@nyx-discord/types';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataOption,
  APIMessageApplicationCommandInteraction,
  APIUserApplicationCommandInteraction,
} from 'discord-api-types/v10';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ComponentType,
  InteractionType,
} from 'discord-api-types/v10';
import type { CoreInteractionTypes } from '../../../src/types/CoreInteractionTypes.js';

export class StubInteraction {
  public static createChatInput(
    commandName = 'mock-chat-input',
    subcommandGroup?: string | null,
    subcommand?: string | null,
  ): ApplicationCommandInteraction<CoreInteractionTypes> {
    const options: APIApplicationCommandInteractionDataOption[] = [];

    if (subcommandGroup) {
      options.push({
        name: subcommandGroup,
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: subcommand
          ? [
              {
                name: subcommand,
                type: ApplicationCommandOptionType.Subcommand,
              },
            ]
          : [],
      });
    } else if (subcommand) {
      options.push({
        name: subcommand,
        type: ApplicationCommandOptionType.Subcommand,
      });
    }

    return {
      data: {
        type: InteractionType.ApplicationCommand,
        data: {
          name: commandName,
          type: ApplicationCommandType.ChatInput,
          options: options.length > 0 ? options : undefined,
        },
      },
    } as unknown as ApplicationCommandInteraction<CoreInteractionTypes>;
  }

  public static createContextMenu(
    commandName = 'mock-context-menu',
    type:
      | ApplicationCommandType.User
      | ApplicationCommandType.Message = ApplicationCommandType.User,
  ): ApplicationCommandInteraction<CoreInteractionTypes> {
    return {
      data: {
        type: InteractionType.ApplicationCommand,
        data: {
          name: commandName,
          type,
        },
      },
    } as unknown as ApplicationCommandInteraction<CoreInteractionTypes>;
  }

  public static createUserContextMenu(
    commandName = 'mock-user-context-menu',
  ): ToEventProps<APIUserApplicationCommandInteraction> {
    return {
      data: {
        type: InteractionType.ApplicationCommand,
        data: {
          name: commandName,
          type: ApplicationCommandType.User,
        },
      },
    } as unknown as ToEventProps<APIUserApplicationCommandInteraction>;
  }

  public static createMessageContextMenu(
    commandName = 'mock-message-context-menu',
  ): ToEventProps<APIMessageApplicationCommandInteraction> {
    return {
      data: {
        type: InteractionType.ApplicationCommand,
        data: {
          name: commandName,
          type: ApplicationCommandType.Message,
        },
      },
    } as unknown as ToEventProps<APIMessageApplicationCommandInteraction>;
  }

  public static createButton(
    customId = 'btn-id',
  ): ComponentCommandInteraction<CoreInteractionTypes> {
    return {
      data: {
        type: InteractionType.MessageComponent,
        data: {
          custom_id: customId,
          component_type: ComponentType.Button,
        },
      },
    } as unknown as ComponentCommandInteraction<CoreInteractionTypes>;
  }

  public static createModalSubmit(
    customId = 'modal-id',
  ): ComponentCommandInteraction<CoreInteractionTypes> {
    return {
      data: {
        type: InteractionType.ModalSubmit,
        data: {
          custom_id: customId,
        },
      },
    } as unknown as ComponentCommandInteraction<CoreInteractionTypes>;
  }

  public static createAutocomplete(
    commandName = 'mock-autocomplete',
    subcommandGroup?: string | null,
    subcommand?: string | null,
  ): ToEventProps<APIApplicationCommandAutocompleteInteraction> {
    const options: APIApplicationCommandInteractionDataOption[] = [];

    if (subcommandGroup) {
      options.push({
        name: subcommandGroup,
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: subcommand
          ? [
              {
                name: subcommand,
                type: ApplicationCommandOptionType.Subcommand,
              },
            ]
          : [],
      });
    } else if (subcommand) {
      options.push({
        name: subcommand,
        type: ApplicationCommandOptionType.Subcommand,
      });
    }

    return {
      data: {
        type: InteractionType.ApplicationCommandAutocomplete,
        data: {
          name: commandName,
          type: ApplicationCommandType.ChatInput,
          options: options.length > 0 ? options : undefined,
        },
      },
    } as unknown as ToEventProps<APIApplicationCommandAutocompleteInteraction>;
  }

  public static createUnknown(): ComponentCommandInteraction<CoreInteractionTypes> {
    return {
      data: {
        type: 999,
        data: {},
      },
    } as unknown as ComponentCommandInteraction<CoreInteractionTypes>;
  }
}
