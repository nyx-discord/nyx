import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

import type { ErrorHandlerContainer } from '../../../../error/handler/ErrorHandlerContainer.js';
import type { MiddlewareListContainer } from '../../../../middleware/list/MiddlewareListContainer.js';
import type { ContextMenuCommand } from '../../commands/ContextMenuCommand';
import type { AnyExecutableCommand } from '../../commands/executable/AnyExecutableCommand';
import type { ChatExecutableCommand } from '../../commands/executable/ChatExecutableCommand';
import type { CommandErrorHandler } from '../../error/CommandErrorHandler.js';
import type { CommandExecutableInteraction } from '../../interaction/CommandExecutableInteraction.js';
import type { ComponentCommandInteraction } from '../../interaction/ComponentCommandInteraction.js';
import type { CommandMiddleware } from '../../middleware/CommandMiddleware.js';
import type { CommandExecutionMeta } from '../meta/CommandExecutionMeta.js';

/** An object responsible for executing commands, making sure that they satisfy the middleware and catching any errors in the process. */
export interface CommandExecutor
  extends ErrorHandlerContainer<CommandErrorHandler>,
    MiddlewareListContainer<CommandMiddleware> {
  execute(
    command: AnyExecutableCommand,
    interaction: CommandExecutableInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<boolean>;

  /** Executes a {@link ChatInputCommandInteraction} on a {@link ExecutableCommand}. */
  executeChatInput(
    command: ChatExecutableCommand<unknown>,
    interaction: ChatInputCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Executes a {@link ComponentCommandInteraction} on a {@link ExecutableCommand}. */
  executeComponent(
    command: AnyExecutableCommand,
    interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Autocompletes (responds) a {@link AutocompleteInteraction} with the provided options from {@link ExecutableCommand#autocomplete}. */
  autocomplete(
    command: ChatExecutableCommand<unknown>,
    interaction: AutocompleteInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Executes a {@link UserContextMenuCommandInteraction} on a {@link StandaloneCommand}. */
  executeUser(
    command: ContextMenuCommand,
    interaction: UserContextMenuCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Executes a {@link MessageContextMenuCommandInteraction} on a {@link StandaloneCommand}. */
  executeMessage(
    command: ContextMenuCommand,
    interaction: MessageContextMenuCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;
}
