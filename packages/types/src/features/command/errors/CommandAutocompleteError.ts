import type { Metadata } from '../../../meta/Metadata';
import type { InteractionTypes } from '../InteractionTypes';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import { CommandError } from './CommandError.js';

/** An Error that wraps errors that occur during the execution of {@link ExecutableCommand#autocomplete}. */
export class CommandAutocompleteError<
  Types extends InteractionTypes = InteractionTypes,
> extends CommandError<Types> {
  protected override readonly interaction: Types['AutocompleteInteraction'];

  constructor(
    error: Error,
    command: AnyExecutableCommand<Types>,
    interaction: Types['AutocompleteInteraction'],
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
  public override getInteraction(): Types['AutocompleteInteraction'] {
    return this.interaction;
  }
}
