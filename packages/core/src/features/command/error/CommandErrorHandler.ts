import type { ErrorHandler } from '../../../error/handler/ErrorHandler.js';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '../execution/args/CommandExecutionArgs.js';

export interface CommandErrorHandler
  extends ErrorHandler<AnyExecutableCommand, CommandExecutionArgs> {}
