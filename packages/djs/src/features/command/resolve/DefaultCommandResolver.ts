import type {
  AnyExecutableCommand,
  ApplicationCommandInteraction,
  CommandCustomIdData,
  CommandRepository,
  CommandResolver,
  ContextMenuCommand,
} from '@nyx-discord/types';
import { ApplicationCommandType as ApplicationCommandTypeEnum } from 'discord-api-types/v10';
import type { AutocompleteInteraction } from 'discord.js';
import type { DjsInteractionTypes } from '../../../types/DjsInteractionTypes.js';

export class DefaultCommandResolver implements CommandResolver<DjsInteractionTypes> {
  public static create(): CommandResolver<DjsInteractionTypes> {
    return new this();
  }

  public resolveFromCommandInteraction(
    interaction: ApplicationCommandInteraction<DjsInteractionTypes>,
    repository: CommandRepository<DjsInteractionTypes>,
  ): AnyExecutableCommand<DjsInteractionTypes> | null {
    return this.resolve(interaction, repository);
  }

  public resolveFromAutocompleteInteraction(
    interaction: AutocompleteInteraction,
    repository: CommandRepository<DjsInteractionTypes>,
  ): AnyExecutableCommand<DjsInteractionTypes> | null {
    return this.resolve(interaction, repository);
  }

  public resolveFromCustomIdData(
    data: CommandCustomIdData,
    repository: CommandRepository<DjsInteractionTypes>,
  ): AnyExecutableCommand<DjsInteractionTypes> | null {
    const commands = repository.getCommands();
    const topLevel = commands.get(data.name);
    if (!topLevel) return null;

    switch (data.type) {
      case ApplicationCommandTypeEnum.ChatInput: {
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
      case ApplicationCommandTypeEnum.User: {
        return topLevel.getData().type === ApplicationCommandTypeEnum.User
          ? (topLevel as ContextMenuCommand<DjsInteractionTypes>)
          : null;
      }
      case ApplicationCommandTypeEnum.Message:
        return topLevel.getData().type === ApplicationCommandTypeEnum.Message
          ? (topLevel as ContextMenuCommand<DjsInteractionTypes>)
          : null;
      default:
        return null;
    }
  }

  /** Resolves a command given a chat input or autocomplete interaction. */
  protected resolve(
    interaction:
      | ApplicationCommandInteraction<DjsInteractionTypes>
      | AutocompleteInteraction,
    repository: CommandRepository<DjsInteractionTypes>,
  ): AnyExecutableCommand<DjsInteractionTypes> | null {
    const { commandName } = interaction;
    if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) {
      return this.findTopLevelExecutable(commandName, repository);
    }

    const group = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand(false);

    if (!group && !subcommand) {
      return this.findTopLevelExecutable(commandName, repository);
    }

    if (group) {
      if (!subcommand) return null;
      return repository.locateByNameTree(commandName, group, subcommand);
    }

    if (subcommand) {
      const found = repository.locateByNameTree(commandName, subcommand);
      if (!found || found.isSubCommandGroup()) return null;
      return found;
    }

    return this.findTopLevelExecutable(commandName, repository);
  }

  /** Finds a top level executable command inside a repository. */
  protected findTopLevelExecutable(
    commandName: string,
    repository: CommandRepository<DjsInteractionTypes>,
  ): AnyExecutableCommand<DjsInteractionTypes> | null {
    const found = repository.locateByNameTree(commandName);
    if (!found || found.isParent()) return null;
    return found;
  }
}
