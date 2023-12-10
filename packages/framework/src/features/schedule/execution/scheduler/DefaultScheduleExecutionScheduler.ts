/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
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

import type { ReadonlyCollection } from '@discordjs/collection';
import type {
  Identifier,
  Schedule,
  ScheduleExecutionScheduler,
  ScheduleExecutor,
  ScheduleJobAdapter,
  ScheduleTickMeta,
} from '@nyx-discord/core';
import {
  canBeIdentifier,
  IllegalStateError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { CronJobParams } from 'cron';
import { CronJob } from 'cron';
import type { Awaitable } from 'discord.js';
import { Collection } from 'discord.js';

import { CronJobAdapter } from '../../adapter/CronJobAdapter.js';

type ScheduleJobParams = Omit<CronJobParams, 'cronTime' | 'onTick'>;

export class DefaultScheduleExecutionScheduler
  implements ScheduleExecutionScheduler<CronJob>
{
  protected static readonly DefaultJobParameters: ScheduleJobParams = {
    runOnInit: false,
    start: false,
  };

  protected readonly jobs: Collection<Identifier, ScheduleJobAdapter<CronJob>> =
    new Collection<Identifier, ScheduleJobAdapter<CronJob>>();

  protected readonly executor: ScheduleExecutor;

  protected readonly jobParameters: ScheduleJobParams;

  protected metaFactory: (schedule: Schedule) => ScheduleTickMeta;

  constructor(
    executor: ScheduleExecutor,
    metaFactory: (schedule: Schedule) => ScheduleTickMeta,
    jobParameters: ScheduleJobParams,
  ) {
    this.executor = executor;
    this.metaFactory = metaFactory;
    this.jobParameters = jobParameters;
  }

  public static create(
    executor: ScheduleExecutor,
    metaFactory: (schedule: Schedule) => ScheduleTickMeta,
    jobParameters?: ScheduleJobParams,
  ): ScheduleExecutionScheduler {
    const parameters =
      jobParameters ?? DefaultScheduleExecutionScheduler.DefaultJobParameters;

    return new DefaultScheduleExecutionScheduler(
      executor,
      metaFactory,
      parameters,
    );
  }

  public onSetup(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public onStart(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public onStop(): Awaitable<void> {
    /** Do nothing by default. */
  }

  public async start(schedule: Schedule): Promise<ScheduleJobAdapter<CronJob>> {
    const id = schedule.getId();
    const presentSchedule = this.jobs.get(id);

    if (presentSchedule) {
      throw new IllegalStateError(
        `Schedule ${String(id)} is already scheduled.`,
      );
    }

    const adapter = this.createJob(schedule);
    this.jobs.set(schedule.getId(), adapter);

    await adapter.resume();
    return adapter;
  }

  public async pause(schedule: Schedule): Promise<ScheduleJobAdapter<CronJob>> {
    const id = schedule.getId();
    const job = this.jobs.get(id);

    if (!job) {
      throw new ObjectNotFoundError(`Schedule ${String(id)} is not scheduled.`);
    }

    await job.pause();

    return job;
  }

  public async destroy(schedule: Schedule): Promise<this> {
    const id = schedule.getId();
    const job = this.jobs.get(id);

    if (!job) {
      throw new ObjectNotFoundError(`Schedule ${String(id)} is not scheduled.`);
    }

    await job.destroy();
    this.jobs.delete(id);

    return this;
  }

  public setMetaFactory(
    metaFactory: (schedule: Schedule) => ScheduleTickMeta,
  ): this {
    this.metaFactory = metaFactory;
    return this;
  }

  public getJobs(): ReadonlyCollection<
    Identifier,
    ScheduleJobAdapter<CronJob>
  > {
    return this.jobs;
  }

  public getJobForSchedule(
    scheduleOrId: Schedule | Identifier,
  ): ScheduleJobAdapter<CronJob> | null {
    const id = canBeIdentifier(scheduleOrId)
      ? scheduleOrId
      : scheduleOrId.getId();
    return this.jobs.get(id) ?? null;
  }

  protected createJob(schedule: Schedule): ScheduleJobAdapter<CronJob> {
    const parameters = this.createJobParameters(schedule);

    const interval = schedule.getInterval();
    const job = CronJob.from(parameters);

    return new CronJobAdapter(job, interval);
  }

  protected createJobParameters(schedule: Schedule): CronJobParams {
    let interval = schedule.getInterval();
    if (typeof interval === 'number') {
      interval = this.millisecondsToCron(interval);
    }

    const parameters = {
      cronTime: interval,
      onTick: async () => {
        const meta = this.metaFactory(schedule);
        await this.executor.tick(schedule, meta);
      },
    };

    return { ...this.jobParameters, ...parameters } as CronJobParams;
  }

  protected millisecondsToCron(intervalMs: number): string {
    const seconds = Math.floor(intervalMs / 1000) % 60;
    const minutes = Math.floor(intervalMs / 60000) % 60;
    const hours = Math.floor(intervalMs / 3600000) % 24;

    return `${seconds} ${minutes} ${hours} * * *`;
  }
}
