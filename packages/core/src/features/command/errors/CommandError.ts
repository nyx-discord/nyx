import { FeatureError } from '../../../errors/FeatureError.js';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionMeta } from '../execution/meta/CommandExecutionMeta.js';
import type { CommandResolvableInteraction } from '../interaction/CommandResolvableInteraction.js';

/** An Error that wraps errors that occur during the execution of an {@link ExecutableCommand} object. */
export class CommandError extends FeatureError<AnyExecutableCommand> {
  protected readonly interaction: CommandResolvableInteraction;

  protected readonly meta: CommandExecutionMeta;

  constructor(
    error: Error,
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction,
    meta: CommandExecutionMeta,
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
  public getMeta(): CommandExecutionMeta {
    return this.meta;
  }

  /** Returns the interaction that triggered the command, and thus the error. */
  public getInteraction(): CommandResolvableInteraction {
    return this.interaction;
  }
}
