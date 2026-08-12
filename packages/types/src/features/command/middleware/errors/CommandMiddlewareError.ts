import type { Metadata } from '../../../../meta/Metadata';
import type { InteractionTypes } from '../../InteractionTypes';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import { CommandError } from '../../errors/CommandError.js';
import type { CommandResolvableInteraction } from '../../interaction/CommandResolvableInteraction.js';
import type { CommandMiddleware } from '../CommandMiddleware.js';

export class CommandMiddlewareError<
  Types extends InteractionTypes = InteractionTypes,
> extends CommandError<Types> {
  protected readonly middleware: CommandMiddleware<Types>;

  constructor(
    error: Error,
    middleware: CommandMiddleware<Types>,
    command: AnyExecutableCommand<Types>,
    interaction: CommandResolvableInteraction<Types>,
    meta: Metadata,
  ) {
    super(error, command, interaction, meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): CommandMiddleware<Types> {
    return this.middleware;
  }
}
