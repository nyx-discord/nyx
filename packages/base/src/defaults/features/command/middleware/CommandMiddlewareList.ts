import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { CommandMiddleware } from '#types/features/command/middleware/CommandMiddleware';
import { CommandMiddlewareError } from '#types/features/command/middleware/errors/CommandMiddlewareError';
import type { MiddlewareList } from '#types/middleware/list/MiddlewareList';
import type { Tail } from '#types/types/Tail';
import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';
import { CommandFilterCheckMiddleware } from '../filter/middleware/CommandFilterCheckMiddleware';

export class CommandMiddlewareList<
  Types extends InteractionTypes = InteractionTypes,
> extends AbstractMiddlewareList<CommandMiddleware<Types>> {
  public static create<
    Types extends InteractionTypes = InteractionTypes,
  >(): MiddlewareList<CommandMiddleware<Types>> {
    const list = new this();
    list.add(new CommandFilterCheckMiddleware<Types>());
    return list;
  }

  /** Wraps a generic error in a {@link CommandMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: CommandMiddleware<Types>,
    error: Error,
    command: Parameters<CommandMiddleware<Types>['check']>[0],
    ...args: Tail<Parameters<CommandMiddleware<Types>['check']>>
  ): Error {
    const [interaction, meta] = args;
    return new CommandMiddlewareError<Types>(
      error,
      erroredMiddleware,
      command,
      interaction,
      meta,
    );
  }
}
