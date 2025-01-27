import type { Middleware } from '../../../middleware/Middleware.js';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '../execution/args/CommandExecutionArgs.js';

/** {@link Middleware} that can handle {@link ExecutableCommand} executions. */
export interface CommandMiddleware
  extends Middleware<AnyExecutableCommand, CommandExecutionArgs> {}
