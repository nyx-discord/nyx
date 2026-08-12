import type { Awaitable } from '../../../../types/Awaitable.js';
import type { ReadonlyCollection } from '@discordjs/collection';
import type { BotLifecycleObserver } from '../../../../bot/BotLifecycleObserver';
import type { Identifier } from '../../../../identity/Identifier.js';
import type { ScheduleJobAdapter } from '../../job/ScheduleJobAdapter.js';
import type { UndestroyableScheduleJobAdapter } from '../../job/UndestroyableScheduleJobAdapter.js';
import type { Schedule } from '../../schedule/Schedule.js';

/** An object responsible for tracking the execution of schedules. */
export interface ScheduleExecutionScheduler<
  JobType = unknown,
> extends BotLifecycleObserver {
  /**
   * Starts scheduling (creates a job) for the passed schedule.
   *
   * @throws {IllegalDuplicateError} If the schedule is already registered.
   */
  start(schedule: Schedule): Awaitable<ScheduleJobAdapter<JobType>>;

  /**
   * Pauses the job for the passed schedule.
   *
   * @throws {ObjectNotFoundError} If the schedule is not registered.
   */
  pause(schedule: Schedule): Awaitable<ScheduleJobAdapter<JobType>>;

  /**
   * Destroys the job for the passed schedule.
   *
   * @throws {ObjectNotFoundError} If the schedule is not registered.
   */
  destroy(schedule: Schedule): Awaitable<this>;

  /** Returns the currently saved jobs, keyed by their {@link Schedule} ID. */
  getJobs(): ReadonlyCollection<
    Identifier,
    UndestroyableScheduleJobAdapter<JobType>
  >;

  /** Returns the job that belongs to the passed schedule or schedule ID. */
  getJobForSchedule(
    schedule: Schedule | Identifier,
  ): UndestroyableScheduleJobAdapter<JobType> | null;
}
