import type {
  BotService,
  BotServiceEventArgs,
  BotStatus,
  EventBus,
  Identifier,
  NyxBot,
} from '@nyx-discord/core';
import {
  BotServiceEventEnum,
  BotStatusEnum,
  IllegalStateError,
  TypedFields,
} from '@nyx-discord/core';
import { BasicEventBus } from '../features/event/bus/BasicEventBus.js';
import { DefaultMetaCollectionFactory } from '../meta/DefaultMetaCollectionFactory.js';
import { ensureKey } from '../util/ensureKey';

type StartPromiseData = {
  promise: Promise<NyxBot>;
  resolve: (value: NyxBot) => void;
  reject: (reason?: unknown) => void;
};

type BotServiceOptions = {
  bot: NyxBot;
  bus: EventBus<BotServiceEventArgs>;
};

export class DefaultBotService implements BotService {
  protected readonly bot: NyxBot;

  protected readonly bus: EventBus<BotServiceEventArgs>;

  protected startPromise!: StartPromiseData;

  protected status: BotStatus = BotStatusEnum.Waiting;

  constructor(options: BotServiceOptions) {
    this.bot = options.bot;
    this.bus = options.bus;

    const startPromise: Partial<StartPromiseData> = {};
    startPromise.promise = new Promise<NyxBot>((resolve, reject) => {
      startPromise.resolve = resolve;
      startPromise.reject = reject;
    });
    this.startPromise = startPromise as StartPromiseData;
  }

  public static create(options: {
    bot: NyxBot;
    injections?: Partial<BotServiceOptions>;
  }): BotService {
    const constructorOptions = options.injections ?? {};
    const metaFactory = DefaultMetaCollectionFactory.createWith([
      TypedFields.Bot,
      options.bot,
    ]);

    ensureKey(
      constructorOptions,
      'bus',
      BasicEventBus.createAsync<BotServiceEventArgs>(
        Symbol('BotServiceEventBus'),
        metaFactory,
      ),
    );

    return new DefaultBotService({ ...constructorOptions, bot: options.bot });
  }

  public isRunning(): boolean {
    throw new Error('Method not implemented.');
  }

  public async start(): Promise<this> {
    if (this.status !== BotStatusEnum.Waiting) {
      throw new IllegalStateError(
        `Bot is not in a valid state to start: ${this.status}`,
      );
    }

    try {
      await this.bot.getEventManager().onStart();
      await Promise.all([
        await this.bot.getScheduleManager().onStart(),
        await this.bot.getSessionManager().onStart(),
        await this.bot.getPluginManager().onStart(),
      ]);

      Promise.resolve(this.bus.emit(BotServiceEventEnum.Start, [])).catch(
        (error) => {
          this.bot
            .getLogger()
            .error('Uncaught bus error while emitting start event.', error);
        },
      );
    } catch (error) {
      try {
        this.bot.getLogger().error('Error while starting bot:', error);
      } finally {
        this.startPromise.reject(error);
      }
      throw error;
    }

    this.status = BotStatusEnum.Running;
    const token = this.bot.getToken();
    await this.bot.getClient().login(token);
    await this.bot.getCommandManager().onStart();

    this.startPromise.resolve(this.bot);

    return this;
  }

  public async stop(reason?: Identifier): Promise<this> {
    if (this.status !== BotStatusEnum.Running) {
      throw new IllegalStateError(`Bot is not running: ${this.status}`);
    }

    await Promise.all([
      await this.bot.getEventManager().onStop(),
      await this.bot.getCommandManager().onStop(),
      await this.bot.getScheduleManager().onStop(),
      await this.bot.getEventManager().onStop(),
      await this.bot.getSessionManager().onStop(),
      await this.bot.getPluginManager().onStop(),
    ]);

    Promise.resolve(
      this.bus.emit(BotServiceEventEnum.Stop, reason ? [reason] : []),
    ).catch((error) => {
      this.bot
        .getLogger()
        .error('Uncaught bus error while emitting stop event.', error);
    });

    await this.bot.getClient().destroy();

    return this;
  }

  public getStartPromise(): Promise<NyxBot> {
    if (this.status === BotStatusEnum.Running) {
      return Promise.resolve(this.bot);
    }
    return this.startPromise.promise;
  }

  public getStatus(): BotStatus {
    return this.status;
  }

  public getEventBus(): EventBus<BotServiceEventArgs> {
    return this.bus;
  }
}
