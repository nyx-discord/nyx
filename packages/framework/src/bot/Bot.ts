import type {
  BotOptions,
  BotStatus,
  Identifier,
  InjectableBotDependencies,
  NyxBot,
} from '@nyx-discord/core';
import { Client } from 'discord.js';
import { DefaultCommandManager } from '../features/command/DefaultCommandManager.js';
import { DefaultEventManager } from '../features/event/DefaultEventManager.js';
import { DefaultPluginManager } from '../features/plugin/DefaultPluginManager.js';
import { DefaultScheduleManager } from '../features/schedule/DefaultScheduleManager.js';
import { DefaultSessionManager } from '../features/session/DefaultSessionManager.js';
import { DefaultBotService } from '../service/DefaultBotService.js';

type BotOptionsWithDefaults<
  Implementations extends Partial<InjectableBotDependencies>,
> = Implementations
  & Pick<
    BotOptions<InjectableBotDependencies>,
    'logger' | 'client' | 'id' | 'token' | 'deployCommands'
  >;

/** The main Bot class. */
export class Bot<Implementations extends InjectableBotDependencies>
  implements NyxBot<Implementations>
{
  protected readonly logger: Implementations['logger'];

  protected readonly commands: Implementations['commandManager'];

  protected readonly events: Implementations['eventManager'];

  protected readonly schedules: Implementations['scheduleManager'];

  protected readonly sessions: Implementations['sessionManager'];

  protected readonly plugins: Implementations['pluginManager'];

  protected readonly service: Implementations['service'];

  protected readonly client: Implementations['client'];

  protected readonly id: Identifier;

  protected readonly token: string;

  constructor(optionsGenerator: (bot: NyxBot) => BotOptions<Implementations>) {
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
    Implementations extends Partial<InjectableBotDependencies>,
  >(
    generator: (bot: NyxBot) => BotOptionsWithDefaults<Implementations>,
  ): NyxBot<InjectableBotDependencies & Implementations> {
    return new Bot((bot) => {
      const generatedOptions = generator(bot);
      const defaultOptions = Bot.DefaultOptionsGenerator(
        bot,
        generatedOptions.id,
        generatedOptions.client,
        generatedOptions.deployCommands,
      );

      return {
        ...defaultOptions,
        ...generatedOptions,
      };
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

  public async stop(reason?: Identifier): Promise<this> {
    await this.service.stop(reason);
    return this;
  }

  public getStatus(): BotStatus {
    return this.service.getStatus();
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

  public getClient(): Implementations['client'] {
    return this.client;
  }

  public getCommandManager(): Implementations['commandManager'] {
    return this.commands;
  }

  public getEventManager(): Implementations['eventManager'] {
    return this.events;
  }

  public getId(): Identifier {
    return this.id;
  }

  public getLogger(): Implementations['logger'] {
    return this.logger;
  }

  public getPluginManager(): Implementations['pluginManager'] {
    return this.plugins;
  }

  public getScheduleManager(): Implementations['scheduleManager'] {
    return this.schedules;
  }

  public getService(): Implementations['service'] {
    return this.service;
  }

  public getSessionManager(): Implementations['sessionManager'] {
    return this.sessions;
  }
}
