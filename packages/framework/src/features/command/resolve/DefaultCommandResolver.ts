import type {
  AnyExecutableCommand,
  ApplicationCommandInteraction,
  CommandCustomIdData,
  CommandRepository,
  CommandResolver,
  ContextMenuCommand,
} from '@nyx-discord/core';
import type { AutocompleteInteraction } from 'discord.js';
import { ApplicationCommandType } from 'discord.js';

export class DefaultCommandResolver implements CommandResolver {
  public static create(): CommandResolver {
    return new this();
  }

  public resolveFromCommandInteraction(
    interaction: ApplicationCommandInteraction | AutocompleteInteraction,
    repository: CommandRepository,
  ): AnyExecutableCommand | null {
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

  public resolveFromAutocompleteInteraction(
    interaction: AutocompleteInteraction,
    repository: CommandRepository,
  ) {
    return this.resolveFromCommandInteraction(interaction, repository);
  }

  public resolveFromCustomIdData(
    data: CommandCustomIdData,
    repository: CommandRepository,
  ): AnyExecutableCommand | null {
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
          ? (topLevel as ContextMenuCommand)
          : null;
      }
      case ApplicationCommandType.Message:
        return topLevel.getData().type === ApplicationCommandType.Message
          ? (topLevel as ContextMenuCommand)
          : null;
      default:
        return null;
    }
  }

  /** Finds a top level executable command inside a repository. */
  protected findTopLevelExecutable(
    commandName: string,
    repository: CommandRepository,
  ): AnyExecutableCommand | null {
    const found = repository.locateByNameTree(commandName);
    if (!found || found.isParent()) return null;
    return found;
  }
}
