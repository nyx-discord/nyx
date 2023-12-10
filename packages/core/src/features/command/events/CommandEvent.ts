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

import type { AutocompleteInteraction } from 'discord.js';
import type { ExecutableCommand } from '../commands/abstract/ExecutableCommand.js';
import type { CommandData } from '../data/command/CommandData.js';
import type { CommandExecutionMeta } from '../execution/meta/CommandExecutionMeta.js';
import type { CommandExecutableInteraction } from '../interaction/CommandExecutableInteraction.js';
import type { TopLevelCommand } from '../commands/TopLevelCommand.js';

/** Enum of possible command events. */
export const CommandEventEnum = {
  CommandAdd: 'commandAdd',
  CommandRemove: 'commandRemove',
  CommandRun: 'commandRun',
  CommandAutocomplete: 'commandAutocomplete',
} as const satisfies Record<string, keyof CommandEventArgs>;

/** Type of values of {@link CommandEventEnum}. */
export type CommandEvent =
  (typeof CommandEventEnum)[keyof typeof CommandEventEnum];

/** Record of arguments for each command event. */
export interface CommandEventArgs {
  commandAdd: [command: TopLevelCommand];
  commandRemove: [command: TopLevelCommand];
  commandRun: [
    command: ExecutableCommand<CommandData>,
    interaction: CommandExecutableInteraction,
    meta: CommandExecutionMeta,
  ];
  commandAutocomplete: [
    command: ExecutableCommand<CommandData>,
    interaction: AutocompleteInteraction,
    meta: CommandExecutionMeta,
  ];
}
