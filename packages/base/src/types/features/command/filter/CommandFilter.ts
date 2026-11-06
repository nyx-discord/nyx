import type { Filter } from '#types/filter/Filter';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '../execution/args/CommandExecutionArgs.js';
import type { InteractionTypes } from '../InteractionTypes';

/** {@link Filter} that can filter an {@link ExecutableCommand}'s execution. */
export interface CommandFilter<
  Types extends InteractionTypes = InteractionTypes,
> extends Filter<AnyExecutableCommand<Types>, CommandExecutionArgs<Types>> {}
