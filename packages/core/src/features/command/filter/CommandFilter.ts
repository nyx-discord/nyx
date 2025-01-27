import type { Filter } from '../../../filter/Filter.js';
import type { AnyExecutableCommand } from '../commands/executable/AnyExecutableCommand';
import type { CommandExecutionArgs } from '../execution/args/CommandExecutionArgs.js';

/** {@link Filter} that can filter an {@link ExecutableCommand}'s execution. */
export interface CommandFilter
  extends Filter<AnyExecutableCommand, CommandExecutionArgs> {}
