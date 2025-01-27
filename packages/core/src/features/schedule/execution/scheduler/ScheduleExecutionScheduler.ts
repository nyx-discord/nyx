import type { ReadonlyCollection } from '@discordjs/collection';
import type { Awaitable } from 'discord.js';
import type { Identifier } from '../../../../identity/Identifier.js';
import type { BotLifecycleObserver } from '../../../../types/BotLifecycleObserver';
import type { ScheduleJobAdapter } from '../../job/ScheduleJobAdapter.js';
import type { UndestroyableScheduleJobAdapter } from '../../job/UndestroyableScheduleJobAdapter.js';
import type { Schedule } from '../../schedule/Schedule.js';
import type { ScheduleTickMeta } from '../meta/ScheduleTickMeta.js';

/** An object responsible for tracking the execution of schedules. */
export interface ScheduleExecutionScheduler<JobType = unknown>
  extends BotLifecycleObserver {
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

  /** Sets the factory method used to create {@link ScheduleTickMeta}s for each tick. */
  setMetaFactory(metaFactory: (schedule: Schedule) => ScheduleTickMeta): this;

  /** Returns the currently saved jobs, keyed by their {@link Schedule} ID. */
  getJobs(): ReadonlyCollection<
    Identifier,
    UndestroyableScheduleJobAdapter<JobType>
  >;

  getJobForSchedule(
    schedule: Schedule | Identifier,
  ): UndestroyableScheduleJobAdapter<JobType> | null;
}
