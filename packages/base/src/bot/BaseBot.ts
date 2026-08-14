import type {
  BotOptions,
  BotStatus,
  Identifier,
  InjectableBotDependencies,
  NyxBot,
} from '@nyx-discord/types';

/** The main Bot class, decoupled from any Discord library. */
export class BaseBot<
  Implementations extends InjectableBotDependencies<any, any, any, any> =
    InjectableBotDependencies,
> implements NyxBot<Implementations> {
  protected readonly logger: Implementations['logger'];

  protected readonly commands: Implementations['commandManager'];

  protected readonly clientEventBus: Implementations['clientEventBus'];

  protected readonly schedules: Implementations['scheduleManager'];

  protected readonly plugins: Implementations['pluginManager'];

  protected readonly service: Implementations['service'];

  protected readonly client: Implementations['client'];

  protected readonly token: string;

  protected readonly deployCommands: boolean;

  constructor(optionsGenerator: (bot: NyxBot) => BotOptions<Implementations>) {
    const options = optionsGenerator(this);
    this.client = options.client;
    this.token = options.token;
    this.logger = options.logger;
    this.service = options.service;
    this.commands = options.commandManager;
    this.clientEventBus = options.clientEventBus;
    this.schedules = options.scheduleManager;
    this.plugins = options.pluginManager;
    this.deployCommands = options.deployCommands;
  }

  public async start(): Promise<this> {
    await this.service.start();
    if (this.deployCommands) {
      await this.commands.deploy();
    }
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

  public async subscribeToClient(
    ...subscribers: Parameters<Implementations['clientEventBus']['subscribe']>
  ): Promise<this> {
    await this.clientEventBus.subscribe(...subscribers);
    return this;
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

  public getClientEventBus(): Implementations['clientEventBus'] {
    return this.clientEventBus;
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
}
