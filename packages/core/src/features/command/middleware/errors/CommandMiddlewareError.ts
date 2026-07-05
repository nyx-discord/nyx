import type { Metadata } from '../../../../meta/Metadata';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import { CommandError } from '../../errors/CommandError.js';
import type { CommandResolvableInteraction } from '../../interaction/CommandResolvableInteraction.js';
import type { CommandMiddleware } from '../CommandMiddleware.js';

export class CommandMiddlewareError extends CommandError {
  protected readonly middleware: CommandMiddleware;

  constructor(
    error: Error,
    middleware: CommandMiddleware,
    command: AnyExecutableCommand,
    interaction: CommandResolvableInteraction,
    meta: Metadata,
  ) {
    super(error, command, interaction, meta);
    this.middleware = middleware;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): CommandMiddleware {
    return this.middleware;
  }
}
