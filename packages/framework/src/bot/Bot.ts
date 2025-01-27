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
  ConcreteClient extends Client,
> = Partial<
  BotOptions<
    ConcreteLogger,
    ConcreteCommandManager,
    ConcreteEventManager,
    ConcreteScheduleManager,
    ConcreteSessionManager,
    ConcretePluginManager,
    ConcreteBotService,
    ConcreteClient
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
  ConcreteClient extends Client,
> implements
    NyxBot<
      ConcreteLogger,
      ConcreteCommandManager,
      ConcreteEventManager,
      ConcreteScheduleManager,
      ConcreteSessionManager,
      ConcretePluginManager,
      ConcreteBotService,
      ConcreteClient
    >
{
  protected readonly logger: ConcreteLogger;

  protected readonly commands: ConcreteCommandManager;

  protected readonly events: ConcreteEventManager;

  protected readonly schedules: ConcreteScheduleManager;

  protected readonly sessions: ConcreteSessionManager;

  protected readonly plugins: ConcretePluginManager;

  protected readonly service: ConcreteBotService;

  protected readonly id: Identifier;

  protected readonly client: ConcreteClient;

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
      ConcreteBotService,
      ConcreteClient
    >,
  ) {
    const options = optionsGenerator(this);

    this.client = options.client;
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
    ConcreteClient extends Client,
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
      ConcreteBotService,
      ConcreteClient
    >,
  ): NyxBot<
    ConcreteLogger,
    ConcreteCommandManager,
    ConcreteEventManager,
    ConcreteScheduleManager,
    ConcreteSessionManager,
    ConcretePluginManager,
    ConcreteBotService,
    ConcreteClient
  > {
    return new Bot((bot) => {
      const generatedOptions = generator(bot);
      const defaultOptions = Bot.DefaultOptionsGenerator(
        bot,
        generatedOptions.id,
        generatedOptions.client,
        generatedOptions.deployCommands,
      );

      return { ...defaultOptions, ...generatedOptions } as BotOptions<
        ConcreteLogger,
        ConcreteCommandManager,
        ConcreteEventManager,
        ConcreteScheduleManager,
        ConcreteSessionManager,
        ConcretePluginManager,
        ConcreteBotService,
        ConcreteClient
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

  public getClient(): ConcreteClient {
    return this.client;
  }

  public getCommandManager(): ConcreteCommandManager {
    return this.commands;
  }

  public getEventManager(): ConcreteEventManager {
    return this.events;
  }

  public getId(): Identifier {
    return this.id;
  }

  public getLogger(): ConcreteLogger {
    return this.logger;
  }

  public getPluginManager(): ConcretePluginManager {
    return this.plugins;
  }

  public getScheduleManager(): ConcreteScheduleManager {
    return this.schedules;
  }

  public getService(): ConcreteBotService {
    return this.service;
  }

  public getSessionManager(): ConcreteSessionManager {
    return this.sessions;
  }
}
