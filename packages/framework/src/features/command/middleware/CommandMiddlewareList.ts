import type {
  CommandMiddleware,
  MiddlewareList,
  Tail,
} from '@nyx-discord/core';
import { CommandMiddlewareError } from '@nyx-discord/core';

import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';
import { CommandFilterCheckMiddleware } from '../filter/middleware/CommandFilterCheckMiddleware.js';

export class CommandMiddlewareList extends AbstractMiddlewareList<CommandMiddleware> {
  public static create(): MiddlewareList<CommandMiddleware> {
    const list = new CommandMiddlewareList();
    list.add(new CommandFilterCheckMiddleware());
    return list;
  }

  /** Wraps a generic error in a {@link CommandMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: CommandMiddleware,
    error: Error,
    command: Parameters<CommandMiddleware['check']>[0],
    ...args: Tail<Parameters<CommandMiddleware['check']>>
  ): Error {
    const [interaction, meta] = args;
    return new CommandMiddlewareError(
      error,
      erroredMiddleware,
      command,
      interaction,
      meta,
    );
  }
}
