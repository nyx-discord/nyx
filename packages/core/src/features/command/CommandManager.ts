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

import type { AutocompleteInteraction, Awaitable } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { EventBus } from '../event/bus/EventBus.js';
import type { EventSubscriber } from '../event/subscriber/EventSubscriber.js';
import type { ParentCommand } from './commands/ParentCommand';
import type { TopLevelCommand } from './commands/TopLevelCommand.js';
import type { CommandCustomIdCodec } from './customId/CommandCustomIdCodec.js';
import type { CommandSubscriptionsContainer } from './event/CommandSubscriptionsContainer.js';
import type { CommandEventArgs } from './events/CommandEvent.js';
import type { CommandExecutor } from './execution/executor/CommandExecutor.js';
import type { CommandExecutionMeta } from './execution/meta/CommandExecutionMeta.js';
import type { CommandExecutableInteraction } from './interaction/CommandExecutableInteraction.js';
import type { ReadonlyCommandRepository } from './repository/ReadonlyCommandRepository.js';
import type { CommandResolver } from './resolver/CommandResolver.js';

/** An object that holds methods for interacting with the bot's {@link Command commands}. */
export interface CommandManager extends BotAware, BotLifecycleObserver {
  /**
   * Executes a command using the {@link CommandExecutor}.
   * @fires CommandEvent#CommandRun
   * @returns {Promise<boolean>} A Promise that resolves to true if the command
   *                             is executed successfully.
   */
  execute(
    source: CommandExecutableInteraction,
    meta?: CommandExecutionMeta,
  ): Awaitable<boolean>;

  /**
   * Autocompletes a command using the {@link CommandExecutor}.
   * @fires CommandEvent#CommandAutocomplete
   * @returns {Promise<boolean>} A Promise that resolves to true if the
   *                             autocompletion is successful.
   */
  autocomplete(
    interaction: AutocompleteInteraction,
    meta?: CommandExecutionMeta,
  ): Awaitable<boolean>;

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

  /**
   * Subscribes an event subscriber to the manager's bus.
   *
   * Alias of:
   * ```
   * const managerBus = commandManager.getEventBus();
   * await eventManager.subscribe(subscriber, managerBus);
   * ```
   */
  subscribe(
    subscriber: EventSubscriber<CommandEventArgs, keyof CommandEventArgs>,
  ): Awaitable<void>;

  /** Returns the {@link CommandSubscriptionsContainer} for this manager. */
  getSubscriptions(): CommandSubscriptionsContainer;

  /** Returns the {@link CommandCustomIdCodec} for this manager. */
  getCustomIdCodec(): CommandCustomIdCodec;

  /** Returns the {@link CommandResolver} for this manager. */
  getResolver(): CommandResolver;

  /** Returns the {@link CommandExecutor} for this manager. */
  getExecutor(): CommandExecutor;

  /** Returns the {@link CommandRepository} for this manager. */
  getRepository(): ReadonlyCommandRepository;

  /** Returns the {@link EventBus} for this manager. */
  getEventBus(): EventBus<CommandEventArgs>;
}
