import type {
  AnyExecutableCommand,
  CommandExecutionArgs,
  CommandFilter,
} from '@nyx-discord/core';

import { AbstractFilter } from '../../../filter/AbstractFilter.js';

/** A {@link AbstractFilter Filter} for filtering Command executions. */
export abstract class AbstractCommandFilter
  extends AbstractFilter<AnyExecutableCommand, CommandExecutionArgs>
  implements CommandFilter {}
