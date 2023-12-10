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

import type { ParentCommand } from '../commands/ParentCommand.js';
import type { StandaloneCommand } from '../commands/StandaloneCommand.js';
import type { SubCommand } from '../commands/SubCommand.js';
import type { SubCommandGroup } from '../commands/SubCommandGroup.js';

/** An object for visiting a command tree. */
export interface CommandVisitor<Returns> {
  /** Starts visiting the command tree. */
  visit(): Returns;

  /** Visits a {@link StandaloneCommand}. */
  visitStandaloneCommand(command: StandaloneCommand): void;

  /** Visits a {@link ParentCommand}. */
  visitParentCommand(command: ParentCommand): void;

  /** Visits a {@link SubCommand}. */
  visitSubCommand(subcommand: SubCommand): void;

  /** Visits a {@link SubCommandGroup}. */
  visitSubCommandGroup(group: SubCommandGroup): void;
}
