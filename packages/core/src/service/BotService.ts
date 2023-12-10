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

import type { Awaitable } from 'discord.js';
import type { BotAware } from '../bot/BotAware.js';
import type { NyxBot } from '../bot/NyxBot.js';
import type { EventBus } from '../features/event/bus/EventBus.js';
import type { BotStatus } from './BotStatus.js';
import type { BotServiceEventArgs } from './events/BotServiceEvent.js';

/** The object responsible for managing and informing about the status of a {@link BotStatus}. */
export interface BotService extends BotAware {
  /**
   * Setups every component in the bot.
   *
   * @throws {IllegalStateError} If the bot is already running, has already
   *   been setup or it has been stopped.
   * @throws {Error} If any error is thrown while starting the managers or
   *   logging in.
   */
  setup(): Awaitable<this>;

  /**
   * Starts the bot, that is setting it up and logging.
   *
   * @throws {IllegalStateError} If the bot is already running, or it has been
   *   stopped.
   * @throws {Error} If any error is thrown while starting the managers or
   *   logging in.
   */
  start(): Awaitable<this>;

  /**
   * Stops the bot.
   *
   * @throws {IllegalStateError} If the bot is not running.
   * @throws {Error} If any error is thrown while stopping the managers.
   */
  stop(reason?: string): Awaitable<this>;

  /** Returns a promise that will resolver once a start is successful. */
  getStartPromise(): Promise<NyxBot>;

  /**
   * Returns whether the bot is running.
   *
   * Alias for `bot.getStatus() === BotStatusEnum.Running`.
   */
  isRunning(): boolean;

  getEventBus(): EventBus<BotServiceEventArgs>;

  /** Returns the current status of the bot. */
  getStatus(): BotStatus;
}
