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
import type { ApplicationCommand, Awaitable } from 'discord.js';

import type { TopLevelCommand } from '../commands/TopLevelCommand';

export interface CommandDeployer extends IterableIterator<ApplicationCommand> {
  /**
   * Notifies the deployer about the Client start, and deploys the commands.
   *
   * @throws {IllegalStateError} If the deployer has already started.
   * @throws {Error} If there was an error while deploying the commands.
   */
  start(): Awaitable<this>;

  /**
   * Registers commands on Discord if the deployer has started, otherwise
   * saves them for later.
   *
   * @throws {AssertionError} If a command is already registered.
   * @throws {Error} If there was an error while building or deploying the commands.
   */
  addCommands(...commands: TopLevelCommand[]): Awaitable<this>;

  /**
   * Unregisters commands on Discord if the deployer has started, otherwise
   * removes them from the pending add list.
   *
   * @throws {ObjectNotFoundError} If that command is not deployed or in the pending add list.
   * @throws {Error} If there was an error while undeploying the commands.
   */
  removeCommands(...commands: TopLevelCommand[]): Awaitable<this>;

  /**
   * Edits commands on Discord. Requires the deployer to have started.
   *
   * @throws {IllegalStateError} If the deployer has not started.
   * @throws {ObjectNotFoundError} If that command is not deployed.
   * @throws {Error} If there was an error while editing the commands.
   */
  editCommands(...commands: TopLevelCommand[]): Awaitable<this>;

  /**
   * Returns the Discord ApplicationCommands that have been deployed,
   * keyed by the command ID.
   *
   * Use them only to extract data. Prefer this object's (or the CommandManager's)
   * methods to add/remove/edit commands.
   */
  getMappings(): ReadonlyCollection<string, ApplicationCommand>;

  /** Returns an iterator for the deployed ApplicationCommands. */
  values(): IterableIterator<ApplicationCommand>;

  /** Returns an iterator for the deployed commands' IDs. */
  keys(): IterableIterator<string>;

  /** Returns an iterator for the deployed commands. */
  entries(): IterableIterator<[string, ApplicationCommand]>;
}
