import { FeatureError } from '../../../errors/FeatureError.js';
import type { Metadata } from '../../../meta/Metadata';
import type { InteractionTypes } from '../InteractionTypes';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandResolvableInteraction } from '../interaction/CommandResolvableInteraction.js';

/** An Error that wraps errors that occur during the execution of an {@link ExecutableCommand} object. */
export class CommandError<
  Types extends InteractionTypes = InteractionTypes,
> extends FeatureError<AnyExecutableCommand<Types>> {
  protected readonly interaction: CommandResolvableInteraction<Types>;

  protected readonly meta: Metadata;

  constructor(
    error: Error,
    command: AnyExecutableCommand<Types>,
    interaction: CommandResolvableInteraction<Types>,
    meta: Metadata,
    message?: string,
  ) {
    super(
      error,
      command,
      message ?? 'There was an error while executing a command.',
    );
    this.meta = meta;
    this.interaction = interaction;
  }

  /** Returns the execution meta that was passed alongside the interaction. */
  public getMeta(): Metadata {
    return this.meta;
  }

  /** Returns the interaction that triggered the command, and thus the error. */
  public getInteraction(): CommandResolvableInteraction<Types> {
    return this.interaction;
  }
}
