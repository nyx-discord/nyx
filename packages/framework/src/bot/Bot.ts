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

import type {
  BotOptions,
  BotService,
  CommandManager,
  EventManager,
  Identifier,
  NyxBot,
  NyxLogger,
  PluginManager,
  ScheduleManager,
  SessionManager,
} from '@nyx-discord/core';
import type { Client } from 'discord.js';

import { DefaultCommandManager } from '../features/command/DefaultCommandManager.js';
import { DefaultEventManager } from '../features/event/DefaultEventManager.js';
import { DefaultPluginManager } from '../features/plugin/DefaultPluginManager.js';
import { DefaultScheduleManager } from '../features/schedule/DefaultScheduleManager.js';
import { DefaultSessionManager } from '../features/session/DefaultSessionManager.js';
import { DefaultBotService } from '../service/DefaultBotService.js';

type BotOptionsWithDefaults<
  ConcreteLogger extends NyxLogger,
  ConcreteCommandManager extends CommandManager,
  ConcreteEventManager extends EventManager,
  ConcreteScheduleManager extends ScheduleManager,
  ConcreteSessionManager extends SessionManager,
  ConcretePluginManager extends PluginManager,
  ConcreteBotService extends BotService,
> = Partial<
  BotOptions<
    ConcreteLogger,
    ConcreteCommandManager,
    ConcreteEventManager,
    ConcreteScheduleManager,
    ConcreteSessionManager,
    ConcretePluginManager,
    ConcreteBotService
  >
> &
  Pick<
    BotOptions<
      ConcreteLogger,
      ConcreteCommandManager,
      ConcreteEventManager,
      ConcreteScheduleManager,
      ConcreteSessionManager,
      ConcretePluginManager,
      ConcreteBotService
    >,
    'logger' | 'client' | 'id' | 'token' | 'deployCommands'
  >;

/** The main Bot class. */
export class Bot<
  ConcreteLogger extends NyxLogger,
  ConcreteCommandManager extends CommandManager,
  ConcreteEventManager extends EventManager,
  ConcreteScheduleManager extends ScheduleManager,
  ConcreteSessionManager extends SessionManager,
  ConcretePluginManager extends PluginManager,
  ConcreteBotService extends BotService,
> implements NyxBot
{
  public readonly logger: ConcreteLogger;

  public readonly commands: ConcreteCommandManager;

  public readonly events: ConcreteEventManager;

  public readonly schedules: ConcreteScheduleManager;

  public readonly sessions: ConcreteSessionManager;

  public readonly plugins: ConcretePluginManager;

  public readonly service: ConcreteBotService;

  public readonly id: Identifier;

  public readonly client: Client<true>;

  protected readonly token: string;

  constructor(
    optionsGenerator: (
      bot: NyxBot,
    ) => BotOptions<
      ConcreteLogger,
      ConcreteCommandManager,
      ConcreteEventManager,
      ConcreteScheduleManager,
      ConcreteSessionManager,
      ConcretePluginManager,
      ConcreteBotService
    >,
  ) {
    const options = optionsGenerator(this);

    this.client = options.client as Client<true>;
    this.token = options.token;
    this.id = options.id;

    this.logger = options.logger;
    this.service = options.service;
    this.commands = options.commands;
    this.events = options.events;
    this.schedules = options.schedules;
    this.sessions = options.sessions;
    this.plugins = options.plugins;
  }

  public static create<
    ConcreteLogger extends NyxLogger,
    ConcreteCommandManager extends CommandManager,
    ConcreteEventManager extends EventManager,
    ConcreteScheduleManager extends ScheduleManager,
    ConcreteSessionManager extends SessionManager,
    ConcretePluginManager extends PluginManager,
    ConcreteBotService extends BotService,
  >(
    generator: (
      bot: NyxBot,
    ) => BotOptionsWithDefaults<
      ConcreteLogger,
      ConcreteCommandManager,
      ConcreteEventManager,
      ConcreteScheduleManager,
      ConcreteSessionManager,
      ConcretePluginManager,
      ConcreteBotService
    >,
  ): NyxBot<
    ConcreteLogger,
    ConcreteCommandManager,
    ConcreteEventManager,
    ConcreteScheduleManager,
    ConcreteSessionManager,
    ConcretePluginManager,
    ConcreteBotService
  > {
    return new Bot((bot) => {
      const generatedOptions = generator(bot);
      const defaultOptions = Bot.DefaultOptionsGenerator(
        bot,
        generatedOptions.id,
        generatedOptions.client,
        generatedOptions.deployCommands,
      );

      return { ...defaultOptions, ...generator(bot) } as BotOptions<
        ConcreteLogger,
        ConcreteCommandManager,
        ConcreteEventManager,
        ConcreteScheduleManager,
        ConcreteSessionManager,
        ConcretePluginManager,
        ConcreteBotService
      >;
    });
  }

  public static readonly DefaultOptionsGenerator = (
    bot: NyxBot,
    id: Identifier,
    client: Client,
    deployCommands: boolean,
  ) => {
    const eventManager = DefaultEventManager.create(bot, client);

    return {
      events: eventManager,
      commands: DefaultCommandManager.create(
        bot,
        client,
        eventManager.getClientBus(),
        deployCommands,
      ),
      schedules: DefaultScheduleManager.create(bot),
      sessions: DefaultSessionManager.create(bot),
      service: DefaultBotService.create(bot),
      plugins: DefaultPluginManager.create(bot),
    };
  };

  public async start(): Promise<this> {
    await this.service.start();
    return this;
  }

  public decorate<Key extends string | symbol, Value>(
    key: Key,
    value: Value,
  ): asserts this is this & Record<Key, Value> {
    Object.defineProperty(this, key, {
      value,
      configurable: false,
      writable: false,
    });
  }

  public getToken(): string {
    return this.token;
  }

  public getId(): Identifier {
    return this.id;
  }
}
