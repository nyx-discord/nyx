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

import type { Awaitable, Client } from 'discord.js';

import type { CommandManager } from '../features/command/CommandManager.js';
import type { EventManager } from '../features/event/EventManager.js';
import type { PluginManager } from '../features/plugin/PluginManager.js';
import type { ScheduleManager } from '../features/schedule/ScheduleManager.js';
import type { SessionManager } from '../features/session/SessionManager.js';
import type { Identifiable } from '../identity/Identifiable.js';
import type { NyxLogger } from '../log/NyxLogger';
import type { BotService } from '../service/BotService.js';

/** A bot of the nyx framework. */
export interface NyxBot<
  ConcreteLogger extends NyxLogger = NyxLogger,
  ConcreteCommandManager extends CommandManager = CommandManager,
  ConcreteEventManager extends EventManager = EventManager,
  ConcreteScheduleManager extends ScheduleManager = ScheduleManager,
  ConcreteSessionManager extends SessionManager = SessionManager,
  ConcretePluginManager extends PluginManager = PluginManager,
  ConcreteService extends BotService = BotService,
  ConcreteClient extends Client = Client,
> extends Identifiable {
  /** Returns the logger of this bot for console output. */
  getLogger(): ConcreteLogger;

  /** Returns the Discord.js {@link Client} of this bot. */
  getClient(): ConcreteClient;

  /** Returns the {@link CommandManager} of this bot for {@link Command} managing. */
  getCommandManager(): ConcreteCommandManager;

  /** Returns the {@link EventManager} of this bot for event managing. */
  getEventManager(): ConcreteEventManager;

  /** Returns the {@link ScheduleManager} of this bot for {@link Schedule} managing. */
  getScheduleManager(): ConcreteScheduleManager;

  /** Returns the {@link SessionManager} of this bot for {@link Session} managing. */
  getSessionManager(): ConcreteSessionManager;

  /** Returns the {@link PluginManager} of this bot for {@link NyxPlugin} managing. */
  getPluginManager(): ConcretePluginManager;

  /** Returns the {@link BotService} of this bot for managing bot status. */
  getService(): ConcreteService;

  /** Starts the bot. Alias for {@link BotService#start}. */
  start(): Awaitable<this>;

  /** Returns this bot's token. */
  getToken(): string;

  /** Decorates the bot object with a value given a key. */
  decorate<Key extends string | symbol, Value>(
    key: Key,
    value: Value,
  ): asserts this is this & Record<Key, Value>;
}
