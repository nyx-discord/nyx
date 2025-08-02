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

type StartPromiseData = {
  promise: Promise<NyxBot>;
  resolve: (value: NyxBot) => void;
  reject: (reason?: unknown) => void;
};

export class DefaultBotService implements BotService {
  public readonly bot: NyxBot;

  protected readonly bus: EventBus<BotServiceEventArgs>;

  protected startPromise!: StartPromiseData;

  protected status: BotStatus = BotStatusEnum.Waiting;

  constructor(bot: NyxBot, bus: EventBus<BotServiceEventArgs>) {
    this.bot = bot;
    this.bus = bus;

    const startPromise: Partial<StartPromiseData> = {};
    startPromise.promise = new Promise<NyxBot>((resolve, reject) => {
      startPromise.resolve = resolve;
      startPromise.reject = reject;
    });
    this.startPromise = startPromise as StartPromiseData;
  }

  public static create(bot: NyxBot): BotService {
    const metaFactory = DefaultMetaCollectionFactory.createWith([
      TypedFields.Bot,
      bot,
    ]);

    const busId = Symbol('BotServiceEventBus');
    const bus = BasicEventBus.createAsync<BotServiceEventArgs>(
      busId,
      metaFactory,
    );

    return new DefaultBotService(bot, bus);
  }

  isRunning(): boolean {
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
        await this.bot.getCommandManager().onStart(),
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

    await this.bus.onUnregister();
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
