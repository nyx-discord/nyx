import type {
  AnyExecutableCommand,
  ApplicationCommandInteraction,
  CommandCustomIdData,
  CommandRepository,
  CommandResolver,
  ContextMenuCommand,
} from '@nyx-discord/types';
import type {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataOption,
} from 'discord-api-types/v10';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionType,
} from 'discord-api-types/v10';
import type { CoreInteractionContext } from '../../../types/CoreInteractionContext.js';
import type { CoreInteractionTypes } from '../../../types/CoreInteractionTypes.js';

export class DefaultCommandResolver implements CommandResolver<CoreInteractionTypes> {
  public static create(): CommandResolver<CoreInteractionTypes> {
    return new this();
  }

  public resolveFromCommandInteraction(
    interaction: ApplicationCommandInteraction<CoreInteractionTypes>,
    repository: CommandRepository<CoreInteractionTypes>,
  ): AnyExecutableCommand<CoreInteractionTypes> | null {
    return this.resolve(interaction, repository);
  }

  public resolveFromAutocompleteInteraction(
    interaction: CoreInteractionContext<APIApplicationCommandAutocompleteInteraction>,
    repository: CommandRepository<CoreInteractionTypes>,
  ): AnyExecutableCommand<CoreInteractionTypes> | null {
    return this.resolve(interaction, repository);
  }

  public resolveFromCustomIdData(
    data: CommandCustomIdData,
    repository: CommandRepository<CoreInteractionTypes>,
  ): AnyExecutableCommand<CoreInteractionTypes> | null {
    const commands = repository.getCommands();
    const topLevel = commands.get(data.name);
    if (!topLevel) return null;

    switch (data.type) {
      case ApplicationCommandType.ChatInput: {
        if (data.subcommand) {
          if (!topLevel.isParent()) return null;

          const first = topLevel.findChildByName(data.group ?? data.subcommand);
          if (!first) return null;

          if (first.isSubCommand()) {
            return first;
          }

          return first.findChildByName(data.subcommand);
        }

        if (!topLevel.isStandalone()) return null;
        return topLevel;
      }
      case ApplicationCommandType.User: {
        return topLevel.getData().type === ApplicationCommandType.User
          ? (topLevel as ContextMenuCommand<CoreInteractionTypes>)
          : null;
      }
      case ApplicationCommandType.Message:
        return topLevel.getData().type === ApplicationCommandType.Message
          ? (topLevel as ContextMenuCommand<CoreInteractionTypes>)
          : null;
      default:
        return null;
    }
  }

  /** Resolves a command given an application command or autocomplete interaction. */
  protected resolve(
    interaction:
      | ApplicationCommandInteraction<CoreInteractionTypes>
      | CoreInteractionContext<APIApplicationCommandAutocompleteInteraction>,
    repository: CommandRepository<CoreInteractionTypes>,
  ): AnyExecutableCommand<CoreInteractionTypes> | null {
    const data = interaction.data;
    const commandName = data.data.name;

    if (data.type === InteractionType.ApplicationCommand) {
      if (data.data.type !== ApplicationCommandType.ChatInput) {
        return this.findTopLevelExecutable(commandName, repository);
      }
      return this.resolveChatInput(commandName, data.data.options, repository);
    }

    return this.resolveChatInput(commandName, data.data.options, repository);
  }

  /** Resolves a chat input (or autocomplete) command, handling subcommands and groups. */
  protected resolveChatInput(
    commandName: string,
    options: APIApplicationCommandInteractionDataOption[] | undefined,
    repository: CommandRepository<CoreInteractionTypes>,
  ): AnyExecutableCommand<CoreInteractionTypes> | null {
    if (!options) {
      return this.findTopLevelExecutable(commandName, repository);
    }

    for (const option of options) {
      if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
        const group = option.name;
        const subcommand = option.options?.find(
          (child) => child.type === ApplicationCommandOptionType.Subcommand,
        )?.name;
        if (!subcommand) return null;
        return repository.locateByNameTree(commandName, group, subcommand);
      }

      if (option.type === ApplicationCommandOptionType.Subcommand) {
        const found = repository.locateByNameTree(commandName, option.name);
        if (!found || found.isSubCommandGroup()) return null;
        return found;
      }
    }

    return this.findTopLevelExecutable(commandName, repository);
  }

  /** Finds a top level executable command inside a repository. */
  protected findTopLevelExecutable(
    commandName: string,
    repository: CommandRepository<CoreInteractionTypes>,
  ): AnyExecutableCommand<CoreInteractionTypes> | null {
    const found = repository.locateByNameTree(commandName);
    if (!found || found.isParent()) return null;
    return found;
  }
}
