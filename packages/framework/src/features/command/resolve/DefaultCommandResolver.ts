import type {
  AnyExecutableCommand,
  ApplicationCommandInteraction,
  CommandRepository,
  CommandResolver,
} from '@nyx-discord/core';
import type { AutocompleteInteraction } from 'discord.js';

export class DefaultCommandResolver implements CommandResolver {
  public static create(): CommandResolver {
    return new DefaultCommandResolver();
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
