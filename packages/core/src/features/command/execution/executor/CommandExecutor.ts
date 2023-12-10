/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type {
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

import type { ErrorHandlerContainer } from '../../../../error/handler/ErrorHandlerContainer.js';
import type { MiddlewareListContainer } from '../../../../middleware/list/MiddlewareListContainer.js';
import type { ExecutableCommand } from '../../commands/abstract/ExecutableCommand.js';
import type { StandaloneCommand } from '../../commands/StandaloneCommand.js';
import type { CommandData } from '../../data/command/CommandData.js';
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
    command: ExecutableCommand<CommandData>,
    interaction: CommandExecutableInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<boolean>;

  /** Executes a {@link ChatInputCommandInteraction} on a {@link ExecutableCommand}. */
  executeChatInput(
    command: ExecutableCommand<CommandData>,
    interaction: ChatInputCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Executes a {@link ComponentCommandInteraction} on a {@link ExecutableCommand}. */
  executeComponent(
    command: ExecutableCommand<CommandData>,
    interaction: ComponentCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Autocompletes (responds) a {@link AutocompleteInteraction} with the provided options from {@link ExecutableCommand#autocomplete}. */
  autocomplete(
    command: ExecutableCommand<CommandData>,
    interaction: AutocompleteInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Executes a {@link UserContextMenuCommandInteraction} on a {@link StandaloneCommand}. */
  executeUser(
    command: StandaloneCommand,
    interaction: UserContextMenuCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Executes a {@link MessageContextMenuCommandInteraction} on a {@link StandaloneCommand}. */
  executeMessage(
    command: StandaloneCommand,
    interaction: MessageContextMenuCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;
}
