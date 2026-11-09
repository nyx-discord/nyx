import type { ErrorHandlerContainer } from '#types/error/handler/ErrorHandlerContainer';
import type { Metadata } from '#types/meta/Metadata';
import type { MiddlewareListContainer } from '#types/middleware/list/MiddlewareListContainer';
import type { Awaitable } from '#types/types/Awaitable';
import type { Nameable } from '#types/types/Nameable';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import type { ChatExecutableCommand } from '../../commands/executable/ChatExecutableCommand';
import type { CommandErrorHandler } from '../../error/CommandErrorHandler.js';
import type { CommandExecutableInteraction } from '../../interaction/CommandExecutableInteraction.js';
import type { InteractionTypes } from '../../InteractionTypes';
import type { CommandMiddlewareResolvable } from '../../middleware/CommandMiddlewareResolvable';

/** An object responsible for executing commands, making sure that they satisfy the middleware and catching any errors in the process. */
export interface CommandExecutor<
  Types extends InteractionTypes = InteractionTypes,
>
  extends
    ErrorHandlerContainer<CommandErrorHandler<Types>>,
    MiddlewareListContainer<CommandMiddlewareResolvable<Types>> {
  /** Executes a {@link CommandExecutableInteraction} on a {@link ExecutableCommand}. */
  execute(
    command: AnyExecutableCommand<Types>,
    interaction: CommandExecutableInteraction<Types>,
    metadata: Metadata,
  ): Awaitable<boolean>;

  /** Autocompletes (responds) a {@link AutocompleteInteraction} with the provided options from {@link ExecutableCommand#autocomplete}. */
  autocomplete(
    command: ChatExecutableCommand<Nameable, Types>,
    interaction: Types['AutocompleteInteraction'],
    metadata: Metadata,
  ): Awaitable<void>;
}
