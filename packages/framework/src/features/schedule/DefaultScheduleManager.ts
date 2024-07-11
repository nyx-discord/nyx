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
  ClassImplements,
  EventBus,
  EventSubscriber,
  Identifier,
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
  ScheduleTickMeta,
} from '@nyx-discord/core';

import { BasicEventBus } from '../event/bus/BasicEventBus.js';
import { DefaultScheduleExecutor } from './execution/executor/DefaultScheduleExecutor.js';
import { DefaultScheduleExecutionScheduler } from './execution/scheduler/DefaultScheduleExecutionScheduler.js';
import { DefaultScheduleRepository } from './repository/DefaultScheduleRepository.js';

type ScheduleManagerOptions = {
  executor: ScheduleExecutor;
  repository: ScheduleRepository;
  scheduler: ScheduleExecutionScheduler;
  eventBus: EventBus<ScheduleEventArgs>;
};

export class DefaultScheduleManager implements ScheduleManager {
  public readonly bot: NyxBot;

  protected readonly executor: ScheduleExecutor;

  protected readonly repository: ScheduleRepository;

  protected readonly scheduler: ScheduleExecutionScheduler;

  protected readonly bus: EventBus<ScheduleEventArgs>;

  constructor(bot: NyxBot, options: ScheduleManagerOptions) {
    this.bot = bot;
    this.repository = options.repository;
    this.executor = options.executor;
    this.scheduler = options.scheduler;
    this.bus = options.eventBus;
  }

  public static create(
    bot: NyxBot,
    options?: Partial<ScheduleManagerOptions>,
  ): ScheduleManager {
    const constructorOptions = options ?? {};

    if (!constructorOptions.repository) {
      constructorOptions.repository = DefaultScheduleRepository.create();
    }

    if (!constructorOptions.executor) {
      constructorOptions.executor = DefaultScheduleExecutor.create();
    }

    if (!constructorOptions.scheduler) {
      constructorOptions.scheduler = DefaultScheduleExecutionScheduler.create(
        constructorOptions.executor,
        (schedule) => ScheduleTickMeta.fromSchedule(schedule, bot),
      );
    }

    if (!constructorOptions.eventBus) {
      const busId = Symbol('ScheduleManagerEventBus');

      constructorOptions.eventBus =
        BasicEventBus.createAsync<ScheduleEventArgs>(bot, busId);
    }

    return new DefaultScheduleManager(
      bot,
      constructorOptions as ScheduleManagerOptions,
    );
  }

  public async onStart(): Promise<void> {
    await this.repository.onStart();
    await this.scheduler.onStart();
  }

  public async onStop(): Promise<void> {
    await this.repository.onStop();
    await this.scheduler.onStop();
    await this.bus.onUnregister();
  }

  public async onSetup(): Promise<void> {
    await this.repository.onSetup();
    await this.scheduler.onSetup();
    await this.bus.onRegister();
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
    meta?: ScheduleTickMeta,
  ): Promise<this> {
    const id = canBeIdentifier(scheduleOrId)
      ? scheduleOrId
      : scheduleOrId.getId();
    const schedule = this.repository.getScheduleByID(id);

    if (!schedule) {
      throw new ObjectNotFoundError(`Schedule '${String(id)}' not found.`);
    }

    const metadata = meta ?? ScheduleTickMeta.fromSchedule(schedule, this.bot);
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
}
