import type { AutocompleteInteraction } from 'discord.js';
import type { Metadata } from '../../../meta/Metadata';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import { CommandError } from './CommandError.js';

/** An Error that wraps errors that occur during the execution of {@link ExecutableCommand#autocomplete}. */
export class CommandAutocompleteError extends CommandError {
  protected override readonly interaction: AutocompleteInteraction;

  constructor(
    error: Error,
    command: AnyExecutableCommand,
    interaction: AutocompleteInteraction,
    meta: Metadata,
    message?: string,
  ) {
    super(
      error,
      command,
      interaction,
      meta,
      message ?? 'There was an error while autocompleting a command.',
    );
    this.interaction = interaction;
  }

  /** Returns the interaction that triggered the command, and thus the error. */
  public override getInteraction(): AutocompleteInteraction {
    return this.interaction;
  }
}
