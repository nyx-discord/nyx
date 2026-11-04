import type {
  Identifier,
  Metadata,
  MetadataFactory,
  Schedule,
  ScheduleExecutionScheduler,
  ScheduleExecutor,
  ScheduleJobAdapter,
} from '@nyx-discord/types';
import {
  canBeIdentifier,
  IllegalStateError,
  ObjectNotFoundError,
} from '@nyx-discord/types';
import type { CronOptions } from 'croner';
import { Cron } from 'croner';
import type { Awaitable } from '@nyx-discord/types';
import type { ReadonlyCollection } from '@discordjs/collection';
import { Collection } from '@discordjs/collection';
import { CronJobAdapter } from '../../adapter/CronJobAdapter.js';
import type { TimerJobHandle } from '../../adapter/TimerJobAdapter.js';
import { TimerJobAdapter } from '../../adapter/TimerJobAdapter.js';

/**
 * Options passed to every `croner` job this scheduler creates, for cron string and Date intervals.
 *
 * `paused` is managed by the scheduler: jobs are always created paused, and start on
 * {@link DefaultScheduleExecutionScheduler#start}.
 */
export type ScheduleJobParams = Omit<CronOptions, 'paused'>;

/** The raw job behind each adapter: a croner {@link Cron}, or a {@link TimerJobAdapter}'s current timeout. */
export type DefaultScheduleJob = Cron | TimerJobHandle | null;

/**
 * Schedules cron string and Date intervals with `croner`, and millisecond intervals with a {@link TimerJobAdapter}.
 */
export class DefaultScheduleExecutionScheduler implements ScheduleExecutionScheduler<DefaultScheduleJob> {
  protected static readonly DefaultJobParameters: ScheduleJobParams = {};

  protected readonly jobs: Collection<
    Identifier,
    ScheduleJobAdapter<DefaultScheduleJob>
  > = new Collection<Identifier, ScheduleJobAdapter<DefaultScheduleJob>>();

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

  public async start(
    schedule: Schedule,
  ): Promise<ScheduleJobAdapter<DefaultScheduleJob>> {
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

  public async pause(
    schedule: Schedule,
  ): Promise<ScheduleJobAdapter<DefaultScheduleJob>> {
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
    ScheduleJobAdapter<DefaultScheduleJob>
  > {
    return this.jobs;
  }

  public getJobForSchedule(
    scheduleOrId: Schedule | Identifier,
  ): ScheduleJobAdapter<DefaultScheduleJob> | null {
    const id = canBeIdentifier(scheduleOrId)
      ? scheduleOrId
      : scheduleOrId.getId();
    return this.jobs.get(id) ?? null;
  }

  /** Creates a paused job for the passed schedule. */
  protected createJob(
    schedule: Schedule,
  ): ScheduleJobAdapter<DefaultScheduleJob> {
    const interval = schedule.getInterval();
    const run = async () => {
      const meta = this.createMetadata(schedule);
      await this.executor.tick(schedule, meta);
    };

    if (typeof interval === 'number') {
      return new TimerJobAdapter(interval, run);
    }

    if (interval instanceof Date) {
      this.assertSchedulableDate(interval);
    }

    const job = new Cron(interval, this.createJobOptions(), run);
    return new CronJobAdapter(job, interval);
  }

  /** Creates the croner options for a cron string or Date interval. */
  protected createJobOptions(): CronOptions {
    return { ...this.jobParameters, paused: true };
  }

  /**
   * Asserts that a one-off Date interval can still run.
   *
   * @throws {RangeError} If the date is invalid or is not in the future.
   */
  protected assertSchedulableDate(date: Date): void {
    const time = date.getTime();
    if (Number.isNaN(time)) {
      throw new RangeError('Schedule interval is an invalid Date.');
    }

    if (time <= Date.now()) {
      throw new RangeError(
        `Schedule interval Date ${date.toISOString()} is not in the future.`,
      );
    }
  }

  protected createMetadata(schedule: Schedule): Metadata {
    const executionId = Symbol(
      `Schedule '${String(schedule.getId())}' @${Date.now()}`,
    );
    return this.metaFactory.createOrPopulate(undefined, executionId);
  }
}
