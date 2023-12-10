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

import type { Identifiable } from '../../../../identity/Identifiable.js';
import type { Metadatable } from '../../../../meta/Metadatable.js';
import type { CommandData } from '../../data/command/CommandData.js';
import type { CommandVisitor } from '../../visitor/CommandVisitor.js';
import type { ParentCommand } from '../ParentCommand.js';
import type { StandaloneCommand } from '../StandaloneCommand.js';
import type { SubCommand } from '../SubCommand.js';
import type { SubCommandGroup } from '../SubCommandGroup.js';
import type { ExecutableCommand } from './ExecutableCommand.js';

/** The base of every command that can be executed or stored by the bot. */
export interface Command<Data extends CommandData>
  extends Identifiable<string>,
    Metadatable {
  /** Accepts a CommandVisitor. */
  acceptVisitor(visitor: CommandVisitor<unknown>): void;

  /** Returns the data of this command. */
  getData(): Readonly<Data>;

  /** Returns a readable name of this command, usually the command's name and parents. */
  getReadableName(): string;

  /** Returns whether this is an ExecutableCommand. */
  isExecutable(): this is ExecutableCommand<Data>;

  /** Returns whether this is a ParentCommand. */
  isParentCommand(): this is ParentCommand;

  /** Returns whether this is an StandaloneCommand. */
  isStandaloneCommand(): this is StandaloneCommand;

  /** Returns whether this is a SubCommand. */
  isSubCommand(): this is SubCommand;

  /** Returns whether this is a SubCommandGroup. */
  isSubCommandGroup(): this is SubCommandGroup;

  /** Returns a string representation of the command. Should be alias for {@link getReadableName}. */
  toString(): string;
}
