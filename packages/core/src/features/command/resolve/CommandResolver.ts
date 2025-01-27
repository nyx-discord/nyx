import type { AutocompleteInteraction } from 'discord.js';

import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { ApplicationCommandInteraction } from '../interaction/ApplicationCommandInteraction.js';
import type { CommandRepository } from '../repository/CommandRepository';

/** An object responsible for locating command objects given a command compatible interaction. */
export interface CommandResolver {
  /** Resolves an {@link ExecutableCommand} that the given application interaction refers to. */
  resolveFromCommandInteraction(
    interaction: ApplicationCommandInteraction,
    repository: CommandRepository,
  ): AnyExecutableCommand | null;

  /** Resolves an {@link ExecutableCommand} that the given autocomplete interaction refers to. */
  resolveFromAutocompleteInteraction(
    interaction: AutocompleteInteraction,
    repository: CommandRepository,
  ): AnyExecutableCommand | null;
}
