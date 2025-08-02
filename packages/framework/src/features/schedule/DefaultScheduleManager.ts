import type {
  ClassImplements,
  EventBus,
  EventSubscriber,
  Identifier,
  MetaCollection,
  MetaCollectionFactory,
  NyxBot,
  Schedule,
  ScheduleEventArgs,
  ScheduleExecutionScheduler,
  ScheduleExecutor,
  ScheduleJobAdapter,
  ScheduleManager,
  ScheduleRepository,
  UndestroyableScheduleJobAdapter,
} from '@nyx-discord/core';
import {
  canBeIdentifier,
  IllegalDuplicateError,
  ObjectNotFoundError,
  ScheduleEventEnum,
  TypedFields,
} from '@nyx-discord/core';
import { DefaultMetaCollectionFactory } from '../../meta/DefaultMetaCollectionFactory.js';
import { ensureKey } from '../../util/ensureKey.js';
import { BasicEventBus } from '../event/bus/BasicEventBus.js';
import { DefaultScheduleExecutor } from './execution/executor/DefaultScheduleExecutor.js';
import { DefaultScheduleExecutionScheduler } from './execution/scheduler/DefaultScheduleExecutionScheduler.js';
import { DefaultScheduleRepository } from './repository/DefaultScheduleRepository.js';

type ScheduleManagerOptions = {
  executor: ScheduleExecutor;
  repository: ScheduleRepository;
  scheduler: ScheduleExecutionScheduler;
  eventBus: EventBus<ScheduleEventArgs>;
  metaFactory: MetaCollectionFactory;
};

export class DefaultScheduleManager implements ScheduleManager {
  public readonly bot: NyxBot;

  protected readonly executor: ScheduleExecutor;

  protected readonly repository: ScheduleRepository;

  protected readonly scheduler: ScheduleExecutionScheduler;

  protected readonly bus: EventBus<ScheduleEventArgs>;

  protected readonly metaFactory: MetaCollectionFactory;

  constructor(bot: NyxBot, options: ScheduleManagerOptions) {
    this.bot = bot;
    this.repository = options.repository;
    this.executor = options.executor;
    this.scheduler = options.scheduler;
    this.bus = options.eventBus;
    this.metaFactory = options.metaFactory;
  }

  public static create(
    bot: NyxBot,
    options?: Partial<ScheduleManagerOptions>,
  ): ScheduleManager {
    const constructorOptions = options ?? {};
    const metaFactory = DefaultMetaCollectionFactory.createWith([
      TypedFields.Bot,
      bot,
    ]);

    ensureKey(
      constructorOptions,
      'repository',
      DefaultScheduleRepository.create(),
    );
    ensureKey(constructorOptions, 'executor', DefaultScheduleExecutor.create());
    ensureKey(
      constructorOptions,
      'scheduler',
      DefaultScheduleExecutionScheduler.create(
        constructorOptions.executor,
        metaFactory,
      ),
    );
    ensureKey(
      constructorOptions,
      'eventBus',
      BasicEventBus.createAsync<ScheduleEventArgs>(
        Symbol('ScheduleManagerEventBus'),
        metaFactory,
      ),
    );
    ensureKey(constructorOptions, 'metaFactory', metaFactory);

    return new DefaultScheduleManager(bot, constructorOptions);
  }

  public async onStart(): Promise<void> {
    await this.bus.onRegister();
    await this.repository.onStart();
    await this.scheduler.onStart();
  }

  public async onStop(): Promise<void> {
    await this.repository.onStop();
    await this.scheduler.onStop();
    await this.bus.onUnregister();
  }

  public async addSchedule(
    schedule: Schedule,
  ): Promise<ScheduleJobAdapter<unknown>> {
    const presentSchedule = this.repository.getScheduleByID(schedule.getId());
    if (presentSchedule) {
      throw new IllegalDuplicateError(
        presentSchedule,
        schedule,
        `Schedule with ID ${String(schedule.getId())} already exists.`,
      );
    }

    try {
      await this.repository.addSchedule(schedule);
      const job = await this.scheduler.start(schedule);

      await schedule.onRegister(this.bot);

      Promise.resolve(
        this.bus.emit(ScheduleEventEnum.ScheduleAdd, [schedule]),
      ).catch((error) => {
        const scheduleId = String(schedule.getId());

        this.bot
          .getLogger()
          .error(
            `Uncaught bus error while emitting schedule add '${scheduleId}'.`,
            error,
          );
      });

      return job;
    } catch (error) {
      this.bot
        .getLogger()
        .error(
          `There was an error while adding schedule '${String(
            schedule.getId(),
          )}'.`,
          error,
        );

      throw error;
    }
  }

  public async removeSchedule(
    scheduleOrId: Schedule | Identifier,
  ): Promise<this> {
    const id = canBeIdentifier(scheduleOrId)
      ? scheduleOrId
      : scheduleOrId.getId();
    const schedule = this.repository.getScheduleByID(id);

    if (!schedule) {
      throw new ObjectNotFoundError(
        `Schedule with ID ${String(id)} not found.`,
      );
    }
    try {
      await this.repository.removeSchedule(scheduleOrId);
      await this.scheduler.destroy(schedule);
      await schedule.onUnregister(this.bot);

      Promise.resolve(
        this.bus.emit(ScheduleEventEnum.ScheduleRemove, [schedule]),
      ).catch((error) => {
        const scheduleId = String(schedule.getId());

        this.bot
          .getLogger()
          .error(
            `Uncaught bus error while emitting schedule remove '${scheduleId}'.`,
            error,
          );
      });
    } catch (error) {
      this.bot
        .getLogger()
        .error(
          `There was an error while removing schedule '${String(id)}'.`,
          error,
        );
    }

    return this;
  }

  public async tick(
    scheduleOrId: Schedule | Identifier,
    meta?: MetaCollection,
  ): Promise<this> {
    const id = canBeIdentifier(scheduleOrId)
      ? scheduleOrId
      : scheduleOrId.getId();
    const schedule = this.repository.getScheduleByID(id);

    if (!schedule) {
      throw new ObjectNotFoundError(`Schedule '${String(id)}' not found.`);
    }

    const metadata = this.metaFactory.createOrPopulate(
      meta,
      Symbol(`Schedule '${String(id)}' @${Date.now()}`),
    );
    await this.executor.tick(schedule, metadata);

    return this;
  }

  public async subscribe(
    ...subscribers: EventSubscriber<
      ScheduleEventArgs,
      keyof ScheduleEventArgs
    >[]
  ): Promise<this> {
    await this.bus.subscribe(...subscribers);
    return this;
  }

  public getScheduleByID(id: Identifier): Schedule | null {
    return this.repository.getScheduleByID(id);
  }

  public getJobForSchedule(
    scheduleOrId: Schedule | Identifier,
  ): UndestroyableScheduleJobAdapter<unknown> | null {
    return this.scheduler.getJobForSchedule(scheduleOrId);
  }

  public getScheduleByClass(
    ScheduleClass: ClassImplements<Schedule>,
  ): InstanceType<typeof ScheduleClass> | null {
    return this.repository.getScheduleByClass(ScheduleClass);
  }

  public getExecutor(): ScheduleExecutor {
    return this.executor;
  }

  public getRepository(): ScheduleRepository {
    return this.repository;
  }

  public getScheduler(): ScheduleExecutionScheduler {
    return this.scheduler;
  }

  public getEventBus(): EventBus<ScheduleEventArgs> {
    return this.bus;
  }

  public getMetaCollectionFactory(): MetaCollectionFactory {
    return this.metaFactory;
  }
}
