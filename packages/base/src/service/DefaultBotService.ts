import type {
  BotService,
  BotServiceEventArgs,
  BotStatus,
  EventBus,
  EventSubscriber,
  Identifier,
  NyxBot,
} from '@nyx-discord/types';
import {
  BotServiceEventEnum,
  BotStatusEnum,
  IllegalStateError,
  TypedFields,
} from '@nyx-discord/types';
import { BasicEventBus } from '../features/event/bus/BasicEventBus.js';
import { DefaultMetadataFactory } from '../meta/DefaultMetadataFactory';
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

  protected bus: EventBus<BotServiceEventArgs>;

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
    const metaFactory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      options.bot,
    ]);

    ensureKey(
      constructorOptions,
      'bus',
      BasicEventBus.createAsync<BotServiceEventArgs>(metaFactory),
    );

    return new this({ ...constructorOptions, bot: options.bot });
  }

  public isRunning(): boolean {
    return this.status === BotStatusEnum.Running;
  }

  public async start(): Promise<this> {
    if (this.status !== BotStatusEnum.Waiting) {
      throw new IllegalStateError(
        `Bot is not in a valid state to start: ${this.status}`,
      );
    }

    try {
      await Promise.all([
        this.bot.getCommandManager().onStart(),
        this.bot.getScheduleManager().onStart(),
        this.bot.getPluginManager().onStart(),
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
    try {
      await this.bot.getClient().login();
    } catch (error) {
      this.status = BotStatusEnum.Waiting;
      try {
        this.bot.getLogger().error('Error while logging in bot:', error);
      } finally {
        this.startPromise.reject(error);
      }
      throw error;
    }

    this.startPromise.resolve(this.bot);

    return this;
  }

  public async stop(reason?: Identifier): Promise<this> {
    if (this.status !== BotStatusEnum.Running) {
      throw new IllegalStateError(`Bot is not running: ${this.status}`);
    }

    let stopError: unknown = null;

    try {
      await Promise.all([
        this.bot.getCommandManager().onStop(),
        this.bot.getScheduleManager().onStop(),
        this.bot.getPluginManager().onStop(),
      ]);
    } catch (error) {
      stopError = error;
    }

    Promise.resolve(
      this.bus.emit(BotServiceEventEnum.Stop, reason ? [reason] : []),
    ).catch((error) => {
      this.bot
        .getLogger()
        .error('Uncaught bus error while emitting stop event.', error);
    });

    try {
      await this.bot.getClient().destroy();
    } catch (error) {
      if (!stopError) {
        stopError = error;
      }
    } finally {
      this.status = BotStatusEnum.Waiting;
    }

    if (stopError) {
      throw stopError;
    }

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

  public async setEventBus(
    eventBus: EventBus<BotServiceEventArgs>,
  ): Promise<this> {
    const oldSubscribers = [...this.bus.getSubscribers().values()];
    await eventBus.subscribe(...oldSubscribers);

    const oldMetadataFields = this.bus.getMetadataFactory().getFields();
    for (const pair of oldMetadataFields) {
      eventBus.getMetadataFactory().addDefaultField(...pair);
    }
    this.bus = eventBus;
    return this;
  }

  public async subscribe(
    ...subscribers: EventSubscriber<BotServiceEventArgs>[]
  ): Promise<this> {
    await this.bus.subscribe(...subscribers);
    return this;
  }
}
