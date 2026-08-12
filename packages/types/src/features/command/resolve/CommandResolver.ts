import type { InteractionTypes } from '../InteractionTypes';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandCustomIdData } from '../customId/data/CommandCustomIdData';
import type { ApplicationCommandInteraction } from '../interaction/ApplicationCommandInteraction.js';
import type { CommandRepository } from '../repository/CommandRepository';

/** An object responsible for locating command objects given a command compatible interaction. */
export interface CommandResolver<
  Types extends InteractionTypes = InteractionTypes,
> {
  /** Resolves an {@link ExecutableCommand} that the given application interaction refers to. */
  resolveFromCommandInteraction(
    interaction: ApplicationCommandInteraction<Types>,
    repository: CommandRepository<Types>,
  ): AnyExecutableCommand<Types> | null;

  /** Resolves an {@link ExecutableCommand} that the given autocomplete interaction refers to. */
  resolveFromAutocompleteInteraction(
    interaction: Types['AutocompleteInteraction'],
    repository: CommandRepository<Types>,
  ): AnyExecutableCommand<Types> | null;

  resolveFromCustomIdData(
    data: CommandCustomIdData,
    repository: CommandRepository<Types>,
  ): AnyExecutableCommand<Types> | null;
}
