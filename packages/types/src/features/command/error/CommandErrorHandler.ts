import type { ErrorHandler } from '../../../error/handler/ErrorHandler.js';
import type { InteractionTypes } from '../InteractionTypes';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '../execution/args/CommandExecutionArgs.js';

export interface CommandErrorHandler<
  Types extends InteractionTypes = InteractionTypes,
> extends ErrorHandler<
  AnyExecutableCommand<Types>,
  CommandExecutionArgs<Types>
> {}
