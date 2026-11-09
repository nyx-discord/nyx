import type { ErrorHandler } from '#types/error/handler/ErrorHandler';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '../execution/args/CommandExecutionArgs.js';
import type { InteractionTypes } from '../InteractionTypes';

export interface CommandErrorHandler<
  Types extends InteractionTypes = InteractionTypes,
> extends ErrorHandler<
  AnyExecutableCommand<Types>,
  CommandExecutionArgs<Types>
> {}
