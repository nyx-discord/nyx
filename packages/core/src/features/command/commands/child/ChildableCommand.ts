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

import type { ReadonlyCollection } from '@discordjs/collection';
import type { ClassImplements } from '../../../../types/ClassImplements';
import type { Command } from '../Command';
import type { ChildCommand } from './ChildCommand';

/** A command that can contain {@link ChildCommand children commands}. */
export interface ChildableCommand<Data, Child extends ChildCommand<any, any>>
  extends Command<Data> {
  /** The number of children this command has. */
  readonly size: number;

  /**
   * Adds a list of children to this command.
   * @throws {IllegalDuplicateError} If there's already a registered child with
   *   the name of a child in the list.
   * @throws {RangeError} If adding this child list would make this command
   *   surpass its max children. See {@link getMaxChildren}.
   * @throws {AssertionError} If one of the child's parent is not this command.
   */
  addChildren(...children: Child[]): this;

  /**
   * Removes a child by its instance.
   * @throws {ObjectNotFoundError} If the specified child doesn't exist.
   * @throws {RangeError} If removing this child would leave the command with
   *   no children.
   */
  removeChildByInstance(child: Child): this;

  /**
   * Removes a child by its name.
   * @throws {ObjectNotFoundError} If the specified child doesn't exist.
   * @throws {RangeError} If removing this child would leave the command with no children.
   */
  removeChildByName(child: string): this;

  /** Finds a child by its name. */
  findChildByName(name: string): Child | null;

  /** Returns the children that is an instance of the passed class. */
  findChildByClass<SearchedChild extends ClassImplements<Child>>(
    child: SearchedChild,
  ): InstanceType<SearchedChild> | null;

  /** Returns the children belonging to this command, keyed by their name. */
  getChildren(): ReadonlyCollection<string, Child>;

  /** Returns the maximum amount of children that this command can hold. */
  getMaxChildren(): number;
}
