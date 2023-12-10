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

import type { ReadonlyCollection } from '@discordjs/collection';
import type { ApplicationCommand, Awaitable } from 'discord.js';
import type { ArrayMinLength } from '../../../types/ArrayMinLength';

import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver';
import type { ClassImplements } from '../../../types/ClassImplements.js';
import type { Command } from '../commands/abstract/Command.js';
import type { ExecutableCommand } from '../commands/abstract/ExecutableCommand.js';
import type { ImplementsParentCommand } from '../commands/implements/ImplementsParentCommand.js';
import type { ImplementsStandaloneCommand } from '../commands/implements/ImplementsStandaloneCommand.js';
import type { ImplementsSubCommand } from '../commands/implements/ImplementsSubCommand.js';
import type { ImplementsSubCommandGroup } from '../commands/implements/ImplementsSubCommandGroup.js';
import type { ParentCommand } from '../commands/ParentCommand';
import type { TopLevelCommand } from '../commands/TopLevelCommand.js';
import type { CommandData } from '../data/command/CommandData.js';
import type { CommandReferenceData } from '../resolver/CommandReferenceData.js';

/** An object responsible for storing commands and their correspondent Discord application mappings. */
export interface CommandRepository
  extends BotLifecycleObserver,
    IterableIterator<[string, TopLevelCommand]> {
  /** Returns the number of stored commands. */
  readonly size: number;

  /**
   * Adds a {@link TopLevelCommand command} and registers it on Discord, if the
   * bot has started.
   *
   * @throws {IllegalDuplicateError} If a command with that same data exists.
   */
  addCommand(command: TopLevelCommand): Awaitable<this>;

  /**
   * Removes a {@link TopLevelCommand command} and unregisters it from Discord,
   * if the bot has started.
   *
   * @throws {ObjectNotFoundError} If that command is not registered.
   */
  removeCommand(command: TopLevelCommand): Awaitable<this>;

  /** Updates a parent command on Discord, after its children have changed. */
  updateParentCommand(command: ParentCommand): Awaitable<this>;

  /** Returns whether the passed ID belongs to a registered command. */
  isCommandId(id: string): boolean;

  /** Returns whether the passed command is registered. */
  isCommandInstance(instance: Command<CommandData>): boolean;

  /** Returns the command associated with the passed ID. */
  getCommandById(id: string): Command<CommandData> | null;

  /** Locates an executable command by its reference data. */
  locateByData(
    data: CommandReferenceData,
  ): ExecutableCommand<CommandData> | null;

  /**
   * Locates a {@link SubCommandGroup} by its declaration tree, passing its
   * parent and its class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeParentCommand
   * //  -- SomeSubCommandGroup
   *
   * const locate = this.bot.commands.getRepository().locateByTree;
   *
   * locate(SomeSubCommandGroup); // null
   * locate(SomeParentCommand, SomeSubCommandGroup); // Stored instance of
   *   SomeSubCommandGroup
   */
  locateByTree<T extends ImplementsSubCommandGroup>(
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
   * const locate = this.bot.commands.getRepository().locateByTtre;
   *
   * locate(ChildSubCommand); // null
   * locate(SomeParentCommand, ChildSubCommand); // null
   * locate(SomeParentCommand, SomeSubCommandGroup, ChildSubCommand); // Stored
   *   instance of ChildSubCommand
   */
  locateByTree<T extends ImplementsSubCommand>(
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
   * const locate = this.bot.commands.getRepository().locateByTtre;
   *
   * locate(SomeSubCommand); // null
   * locate(SomeParentCommand, SomeSubCommand); // Stored instance of
   *   SomeSubCommand
   */
  locateByTree<T extends ImplementsSubCommand>(
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
   * const locate = this.bot.commands.getRepository().locateByTree;
   *
   * locate(SomeParentCommand); // Stored instance of SomeParentCommand
   */
  locateByTree<T extends ImplementsParentCommand>(
    ParentCommandClass: T,
  ): InstanceType<T> | null;

  /**
   * Locates a {@link StandaloneCommand} by its declaration tree, passing its
   * class and returning the stored instance.
   * @example
   * // Suppose the structure:
   * // - SomeStandaloneCommand
   *
   * const locate = this.bot.commands.getRepository().locateByTree;
   *
   * locate(SomeStandaloneCommand); // Stored instance of SomeStandaloneCommand
   */
  locateByTree<T extends ImplementsStandaloneCommand>(
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
   * const locate = this.bot.commands.getRepository().locateByTree;
   *
   * locate(SomeStandaloneCommand); // Stored instance of SomeStandaloneCommand
   * locate(SomeParentCommand); // Stored instance of SomeParentCommand
   * locate(SomeParentCommand, SomeSubCommandGroup); // Stored instance of
   *   SomeSubCommandGroup locate(SomeParentCommand, ChildSubCommand); // null
   */
  locateByTree<T extends ClassImplements<Command<CommandData>>>(
    TopLevelCommandClass: ClassImplements<TopLevelCommand>,
    FirstChildClass?: ImplementsSubCommandGroup | ImplementsSubCommand,
    SecondChildClass?: ImplementsSubCommand,
  ): InstanceType<T> | null;

  /** Returns the currently stored top level commands, keyed by their ID. */
  getCommands(): ReadonlyCollection<string, TopLevelCommand>;

  /** Returns the Discord Application mappings of the currently stored commands. */
  getMappings(): ReadonlyCollection<
    string,
    ArrayMinLength<ApplicationCommand, 1>
  >;

  values(): IterableIterator<TopLevelCommand>;

  keys(): IterableIterator<string>;

  entries(): IterableIterator<[string, TopLevelCommand]>;
}
