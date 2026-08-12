import type {
  ClassImplements,
  EventBus,
  EventSubscriber,
  Identifier,
  Metadata,
  MetadataFactory,
  NyxBot,
  Schedule,
  ScheduleEventArgs,
  ScheduleExecutionScheduler,
  ScheduleExecutor,
  ScheduleJobAdapter,
  ScheduleManager,
  ScheduleRepository,
  UndestroyableScheduleJobAdapter,
} from '@nyx-discord/types';
import {
  canBeIdentifier,
  IllegalDuplicateError,
  IllegalStateError,
  ObjectNotFoundError,
  ScheduleEventEnum,
  TypedFields,
} from '@nyx-discord/types';
import { DefaultMetadataFactory } from '../../meta/DefaultMetadataFactory';
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
  metaFactory: MetadataFactory;
};

export class DefaultScheduleManager implements ScheduleManager {
  protected executor: ScheduleExecutor;

  protected repository: ScheduleRepository;

  protected scheduler: ScheduleExecutionScheduler;

  protected bus: EventBus<ScheduleEventArgs>;

  protected metaFactory: MetadataFactory;

  constructor(options: ScheduleManagerOptions) {
    this.repository = options.repository;
    this.executor = options.executor;
    this.scheduler = options.scheduler;
    this.bus = options.eventBus;
    this.metaFactory = options.metaFactory;
  }

  public static create(options: {
    bot: NyxBot;
    injections?: Partial<ScheduleManagerOptions>;
  }): ScheduleManager {
    const constructorOptions = options.injections ?? {};
    const metaFactory = DefaultMetadataFactory.createWith([
      TypedFields.Bot,
      options.bot,
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
      BasicEventBus.createAsync<ScheduleEventArgs>(metaFactory),
    );
    ensureKey(constructorOptions, 'metaFactory', metaFactory);

    return new this(constructorOptions);
  }

  public async onStart(): Promise<void> {
    await this.repository.onStart();
    await this.scheduler.onStart();
  }

  public async onStop(): Promise<void> {
    await this.repository.onStop();
    await this.scheduler.onStop();
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

    let job;
    try {
      await this.repository.addSchedule(schedule);
      job = await this.scheduler.start(schedule);
    } catch (error) {
      if (this.repository.getScheduleByID(schedule.getId())) {
        await this.repository.removeSchedule(schedule);
      }
      if (this.scheduler.getJobForSchedule(schedule)) {
        await this.scheduler.destroy(schedule);
      }
      throw error;
    }

    Promise.resolve(
      this.bus.emit(ScheduleEventEnum.ScheduleAdd, [schedule]),
    ).catch((_error) => {});

    return job;
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

    await this.repository.removeSchedule(scheduleOrId);
    await this.scheduler.destroy(schedule);

    Promise.resolve(
      this.bus.emit(ScheduleEventEnum.ScheduleRemove, [schedule]),
    ).catch((_error) => {});

    return this;
  }

  public async tick(
    scheduleOrId: Schedule | Identifier,
    meta?: Metadata,
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

  public setExecutor(executor: ScheduleExecutor): this {
    this.executor = executor;
    return this;
  }

  public getRepository(): ScheduleRepository {
    return this.repository;
  }

  public setRepository(repository: ScheduleRepository): this {
    if (this.repository.getSchedules().size) {
      throw new IllegalStateError(
        'Cannot set repository while schedules are registered.',
      );
    }
    this.repository = repository;
    return this;
  }

  public getScheduler(): ScheduleExecutionScheduler {
    return this.scheduler;
  }

  public setScheduler(scheduler: ScheduleExecutionScheduler): this {
    if (this.scheduler.getJobs().size) {
      throw new IllegalStateError(
        'Cannot set scheduler while jobs are scheduled.',
      );
    }
    this.scheduler = scheduler;
    return this;
  }

  public getEventBus(): EventBus<ScheduleEventArgs> {
    return this.bus;
  }

  public async setEventBus(
    eventBus: EventBus<ScheduleEventArgs>,
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

  public getMetadataFactory(): MetadataFactory {
    return this.metaFactory;
  }

  public setMetadataFactory(metaFactory: MetadataFactory): this {
    this.metaFactory = metaFactory;
    return this;
  }
}
