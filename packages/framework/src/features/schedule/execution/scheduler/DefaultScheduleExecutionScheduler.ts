import type {
  Identifier,
  Metadata,
  MetadataFactory,
  Schedule,
  ScheduleExecutionScheduler,
  ScheduleExecutor,
  ScheduleJobAdapter,
} from '@nyx-discord/core';
import {
  canBeIdentifier,
  IllegalStateError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { CronJobParams } from 'cron';
import { CronJob } from 'cron';
import type { Awaitable, ReadonlyCollection } from 'discord.js';
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

  protected metaFactory: MetadataFactory;

  constructor(
    executor: ScheduleExecutor,
    metaFactory: MetadataFactory,
    jobParameters: ScheduleJobParams,
  ) {
    this.executor = executor;
    this.metaFactory = metaFactory;
    this.jobParameters = jobParameters;
  }

  public static create(
    executor: ScheduleExecutor,
    metaFactory: MetadataFactory,
    jobParameters?: ScheduleJobParams,
  ): ScheduleExecutionScheduler {
    const parameters =
      jobParameters ?? DefaultScheduleExecutionScheduler.DefaultJobParameters;
    return new this(executor, metaFactory, parameters);
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

  /** Creates a job for the passed schedule. */
  protected createJob(schedule: Schedule): ScheduleJobAdapter<CronJob> {
    const parameters = this.createJobParameters(schedule);

    const interval = schedule.getInterval();
    const job = CronJob.from(parameters);

    return new CronJobAdapter(job, interval);
  }

  /** Creates the job parameters for the passed schedule. */
  protected createJobParameters(schedule: Schedule): CronJobParams {
    let interval = schedule.getInterval();
    if (typeof interval === 'number') {
      interval = this.millisecondsToCron(interval);
    }

    const parameters: CronJobParams = {
      cronTime: interval,
      onTick: async () => {
        const meta = this.createMetadata(schedule);
        await this.executor.tick(schedule, meta);
      },
    };

    return { ...this.jobParameters, ...parameters } as CronJobParams;
  }

  /** Parses a number of milliseconds into a cron string. */
  protected millisecondsToCron(intervalMs: number): string {
    const interval = Math.round(intervalMs / 1000);
    return `*/${interval} * * * * *`;
  }

  protected createMetadata(schedule: Schedule): Metadata {
    const executionId = Symbol(
      `Schedule '${String(schedule.getId())}' @${Date.now()}`,
    );
    return this.metaFactory.create(executionId);
  }
}
