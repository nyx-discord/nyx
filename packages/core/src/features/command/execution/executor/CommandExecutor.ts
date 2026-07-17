import type { AutocompleteInteraction, Awaitable } from 'discord.js';
import type { ErrorHandlerContainer } from '../../../../error/handler/ErrorHandlerContainer.js';
import type { Metadata } from '../../../../meta/Metadata';
import type { MiddlewareListContainer } from '../../../../middleware/list/MiddlewareListContainer.js';
import type { Nameable } from '../../../../types/Nameable';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import type { ChatExecutableCommand } from '../../commands/executable/ChatExecutableCommand';
import type { CommandErrorHandler } from '../../error/CommandErrorHandler.js';
import type { CommandExecutableInteraction } from '../../interaction/CommandExecutableInteraction.js';
import type { CommandMiddlewareResolvable } from '../../middleware/CommandMiddlewareResolvable';

/** An object responsible for executing commands, making sure that they satisfy the middleware and catching any errors in the process. */
export interface CommandExecutor
  extends
    ErrorHandlerContainer<CommandErrorHandler>,
    MiddlewareListContainer<CommandMiddlewareResolvable> {
  /** Executes a {@link CommandExecutableInteraction} on a {@link ExecutableCommand}. */
  execute(
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    metadata: Metadata,
  ): Awaitable<boolean>;

  /** Autocompletes (responds) a {@link AutocompleteInteraction} with the provided options from {@link ExecutableCommand#autocomplete}. */
  autocomplete(
    command: ChatExecutableCommand<Nameable>,
    interaction: AutocompleteInteraction,
    metadata: Metadata,
  ): Awaitable<void>;
}
