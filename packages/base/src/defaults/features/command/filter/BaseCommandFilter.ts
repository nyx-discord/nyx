import type { AnyExecutableCommand } from '#types/features/command/commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '#types/features/command/execution/args/CommandExecutionArgs';
import type { CommandFilter } from '#types/features/command/filter/CommandFilter';
import type { InteractionTypes } from '#types/features/command/InteractionTypes';
import { AbstractFilter } from '../../../filter/AbstractFilter';

/** A {@link AbstractFilter Filter} for filtering Command executions. */
export abstract class BaseCommandFilter<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractFilter<
    AnyExecutableCommand<Types>,
    CommandExecutionArgs<Types>
  >
  implements CommandFilter<Types> {}
