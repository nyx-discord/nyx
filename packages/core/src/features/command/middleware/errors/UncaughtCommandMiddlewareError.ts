import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import { CommandError } from '../../errors/CommandError.js';
import type { CommandExecutionMeta } from '../../execution/meta/CommandExecutionMeta.js';
import type { CommandExecutableInteraction } from '../../interaction/CommandExecutableInteraction.js';
import type { CommandMiddleware } from '../CommandMiddleware.js';

export class UncaughtCommandMiddlewareError extends CommandError {
  protected readonly middlewareList: MiddlewareList<CommandMiddleware>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<CommandMiddleware>,
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    meta: CommandExecutionMeta,
  ) {
    super(error, command, interaction, meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getList(): MiddlewareList<CommandMiddleware> {
    return this.middlewareList;
  }
}
