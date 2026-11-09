import type { Metadata } from '#types/meta/Metadata';
import type { MiddlewareList } from '#types/middleware/list/MiddlewareList';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import { CommandError } from '../../errors/CommandError.js';
import type { CommandExecutableInteraction } from '../../interaction/CommandExecutableInteraction.js';
import type { InteractionTypes } from '../../InteractionTypes';
import type { CommandMiddlewareResolvable } from '../CommandMiddlewareResolvable';

export class UncaughtCommandMiddlewareError<
  Types extends InteractionTypes = InteractionTypes,
> extends CommandError<Types> {
  protected readonly middlewareList: MiddlewareList<
    CommandMiddlewareResolvable<Types>
  >;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<CommandMiddlewareResolvable<Types>>,
    command: AnyExecutableCommand<Types>,
    interaction: CommandExecutableInteraction<Types>,
    meta: Metadata,
  ) {
    super(error, command, interaction, meta);
    this.middlewareList = middlewareList;
  }

  /** Returns the middleware list that threw this error. */
  public getList(): MiddlewareList<CommandMiddlewareResolvable<Types>> {
    return this.middlewareList;
  }
}
