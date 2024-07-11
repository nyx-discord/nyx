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
import type { ClassImplements } from '../../../types/ClassImplements.js';
import type { Command } from '../commands/Command';
import type { ImplementsParentCommand } from '../commands/implements/ImplementsParentCommand.js';
import type { ImplementsStandaloneCommand } from '../commands/implements/ImplementsStandaloneCommand.js';
import type { ImplementsSubCommand } from '../commands/implements/ImplementsSubCommand.js';
import type { ImplementsSubCommandGroup } from '../commands/implements/ImplementsSubCommandGroup.js';
import type { SubCommand } from '../commands/SubCommand';
import type { SubCommandGroup } from '../commands/SubCommandGroup';
import type { TopLevelCommand } from '../commands/TopLevelCommand.js';

/** An object responsible for storing commands. */
export interface CommandRepository
  extends IterableIterator<[string, TopLevelCommand]> {
  /** Returns the number of stored commands. */
  readonly size: number;

  /**
   * Adds a {@link TopLevelCommand command}.
   *
   * @throws {IllegalDuplicateError} If a command with that same data exists.
   */
  addCommand(command: TopLevelCommand): this;

  /**
   * Removes a {@link TopLevelCommand command}.
   *
   * @throws {ObjectNotFoundError} If that command is not registered.
   */
  removeCommand(command: TopLevelCommand): this;

  /** Returns whether the passed ID belongs to a registered command. */
  isCommandId(id: string): boolean;

  /** Returns whether the passed command is registered. */
  isCommandInstance(instance: TopLevelCommand): boolean;

  /** Returns the command associated with the passed name. */
  getCommandByName(id: string): TopLevelCommand | null;

  /**
   * Locates a {@link TopLevelCommand} by its name tree.
   * Equal to {@link CommandRepository#getCommandByName}.
   */
  locateByNameTree(name: string): TopLevelCommand | null;

  /** Locates a {@link SubCommand} or {@link SubCommandGroup} by its name tree. */
  locateByNameTree(
    parent: string,
    child: string,
  ): SubCommand | SubCommandGroup | null;

  /** Locates a {@link SubCommand} by its name tree. */
  locateByNameTree(
    parent: string,
    group: string,
    subCommand: string,
  ): SubCommand | null;

  /** Locates a {@link Command} by its name tree. */
  locateByNameTree(
    parent: string,
    firstChild?: string,
    secondChild?: string,
  ): TopLevelCommand | SubCommand | SubCommandGroup | null;

  /**
   * Locates a {@link SubCommandGroup} by its class tree, passing its
   * parent and its class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   * //  -- SomeSubCommandGroup
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeSubCommandGroup); // null
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommandGroup); // Stored instance of SomeSubCommandGroup
   */
  locateByClassTree<T extends ImplementsSubCommandGroup>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandGroupClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link SubCommand} by its declaration tree, passing its parent,
   * group and its class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   * //  -- SomeSubCommandGroup
   * //    --- ChildSubCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(ChildSubCommand); // null
   * repo.locateByClassTree(SomeParentCommand, ChildSubCommand); // null
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommandGroup, ChildSubCommand); // Stored instance of ChildSubCommand
   */
  locateByClassTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandGroupClass: ImplementsSubCommandGroup,
    SubCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link SubCommand} by its declaration tree, passing its parent
   * class and its class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   * //  -- SomeSubCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeSubCommand); // null
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommand); // Stored instance of SomeSubCommand
   */
  locateByClassTree<T extends ImplementsSubCommand>(
    ParentCommandClass: ImplementsParentCommand,
    SubCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link ParentCommand} by its declaration tree, passing its class
   * and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeParentCommand); // Stored instance of SomeParentCommand
   */
  locateByClassTree<T extends ImplementsParentCommand>(
    ParentCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link StandaloneCommand} by its declaration tree, passing its
   * class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeStandaloneCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeStandaloneCommand); // Stored instance of SomeStandaloneCommand
   */
  locateByClassTree<T extends ImplementsStandaloneCommand>(
    StandaloneCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a stored command by its declaration tree, passing its constructors
   * and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeStandaloneCommand
   * // - SomeParentCommand
   * //  -- SomeSubCommand
   * //  -- SomeSubCommandGroup
   * //    --- ChildSubCommand
   *
   * const repo = this.bot.getCommandManager().getRepository();
   *
   * repo.locateByClassTree(SomeStandaloneCommand); // Stored instance of SomeStandaloneCommand
   * repo.locateByClassTree(SomeParentCommand); // Stored instance of SomeParentCommand
   * repo.locateByClassTree(SomeParentCommand, SomeSubCommandGroup); // Stored instance of SomeSubCommandGroup
   * repo.locateByClassTree(SomeParentCommand, ChildSubCommand); // null
   */
  locateByClassTree<T extends ClassImplements<Command<unknown>>>(
    TopLevelCommandClass: ClassImplements<TopLevelCommand>,
    FirstChildClass?: ImplementsSubCommandGroup | ImplementsSubCommand,
    SecondChildClass?: ImplementsSubCommand,
  ): InstanceType<T> | null;

  /** Returns the currently stored top level commands, keyed by their ID. */
  getCommands(): ReadonlyCollection<string, TopLevelCommand>;

  values(): IterableIterator<TopLevelCommand>;

  keys(): IterableIterator<string>;

  entries(): IterableIterator<[string, TopLevelCommand]>;
}
