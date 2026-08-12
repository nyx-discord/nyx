import type {
  AnyExecutableCommand,
  CommandExecutionArgs,
  CommandFilter,
  InteractionTypes,
} from '@nyx-discord/types';
import { AbstractFilter } from '../../../filter/AbstractFilter.js';

/** A {@link AbstractFilter Filter} for filtering Command executions. */
export abstract class BaseCommandFilter<
  Types extends InteractionTypes = InteractionTypes,
>
  extends AbstractFilter<
    AnyExecutableCommand<Types>,
    CommandExecutionArgs<Types>
  >
  implements CommandFilter<Types> {}
