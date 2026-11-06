import type { AnyExecutableCommand } from '#types/features/command/commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '#types/features/command/execution/args/CommandExecutionArgs';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import type { CommandMiddleware } from '#types/features/command/middleware/CommandMiddleware';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware';

export abstract class BaseCommandMiddleware<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractMiddleware<
    AnyExecutableCommand<Types>,
    CommandExecutionArgs<Types>
  >
  implements CommandMiddleware<Types> {}
