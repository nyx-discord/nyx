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

import type { Client } from 'discord.js';

import type { CommandManager } from '../features/command/CommandManager.js';
import type { EventManager } from '../features/event/EventManager.js';
import type { PluginManager } from '../features/plugin/PluginManager.js';
import type { ScheduleManager } from '../features/schedule/ScheduleManager.js';
import type { SessionManager } from '../features/session/SessionManager.js';
import type { Identifier } from '../identity/Identifier.js';
import type { Logger } from '../log/Logger.js';
import type { BotService } from '../service/BotService.js';

/** Type of options to create a bot. */
export interface BotOptions<
  ConcreteLogger extends Logger = Logger,
  ConcreteCommandManager extends CommandManager = CommandManager,
  ConcreteEventManager extends EventManager = EventManager,
  ConcreteScheduleManager extends ScheduleManager = ScheduleManager,
  ConcreteSessionManager extends SessionManager = SessionManager,
  ConcretePluginManager extends PluginManager = PluginManager,
  ConcreteBotService extends BotService = BotService,
> {
  token: string;
  client: Client;
  id: Identifier;
  logger: ConcreteLogger;
  commands: ConcreteCommandManager;
  events: ConcreteEventManager;
  schedules: ConcreteScheduleManager;
  sessions: ConcreteSessionManager;
  plugins: ConcretePluginManager;
  service: ConcreteBotService;
}
