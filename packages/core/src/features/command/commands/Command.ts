/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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

import type { Metadatable } from '../../../meta/Metadatable';
import type { ContextMenuCommand } from './ContextMenuCommand';
import type { ParentCommand } from './ParentCommand';
import type { StandaloneCommand } from './StandaloneCommand';
import type { SubCommand } from './SubCommand';
import type { SubCommandGroup } from './SubCommandGroup';

/** The base of every command that can be executed or stored by the bot. */
export interface Command<Data> extends Metadatable {
  /** Returns the data for this command. */
  getData(): Data;

  /** Returns the name of this command. */
  getName(): string;

  /** Returns whether this is a ParentCommand. */
  isParent(): this is ParentCommand;

  /** Returns whether this is an ContextMenuCommand. */
  isContextMenu(): this is ContextMenuCommand;

  /** Returns whether this is a StandaloneCommand. */
  isStandalone(): this is StandaloneCommand;

  /** Returns whether this is a SubCommand. */
  isSubCommand(): this is SubCommand;

  /** Returns whether this is a SubCommandGroup. */
  isSubCommandGroup(): this is SubCommandGroup;

  /** Returns the names of the tree of this command. */
  getNameTree(): ReadonlyArray<string>;
}
