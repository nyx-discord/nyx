import type { MetaCollection } from '../../../../meta/MetaCollection';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import { CommandError } from '../../errors/CommandError.js';
import type { CommandExecutableInteraction } from '../../interaction/CommandExecutableInteraction.js';
import type { CommandMiddlewareResolvable } from '../CommandMiddlewareResolvable';

export class UncaughtCommandMiddlewareError extends CommandError {
  protected readonly middlewareList: MiddlewareList<CommandMiddlewareResolvable>;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<CommandMiddlewareResolvable>,
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    meta: MetaCollection,
  ) {
    super(error, command, interaction, meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getList(): MiddlewareList<CommandMiddlewareResolvable> {
    return this.middlewareList;
  }
}
