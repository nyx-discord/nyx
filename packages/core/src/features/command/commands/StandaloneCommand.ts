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
  Awaitable,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import type { ApplicationCommandType } from 'discord.js';
import type { StandaloneCommandData } from '../data/command/StandaloneCommandData.js';
import type { CommandExecutionMeta } from '../execution/meta/CommandExecutionMeta.js';
import type { ExecutableCommand } from './abstract/ExecutableCommand.js';

/**
 * A fully executable top level command.
 *
 * Can include whether to support
 * {@link https://discord.com/developers/docs/interactions/application-commands#user-commands User Context Menus} and {@link https://discord.com/developers/docs/interactions/application-commands#message-commands Message Context Menus} as well, or even to only support them.
 */
export interface StandaloneCommand
  extends ExecutableCommand<StandaloneCommandData> {
  /** Returns the {@link StandaloneCommandContextData contexts} that the command supports. */
  getContexts(): ReadonlyArray<ApplicationCommandType>;

  /** Execute a user context menu interaction. */
  executeUser(
    interaction: UserContextMenuCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;

  /** Execute a message context menu interaction. */
  executeMessage(
    interaction: MessageContextMenuCommandInteraction,
    metadata: CommandExecutionMeta,
  ): Awaitable<void>;
}
