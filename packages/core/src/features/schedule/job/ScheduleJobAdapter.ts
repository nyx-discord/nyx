import type { Awaitable } from 'discord.js';
import type { ScheduleInterval } from '../interval/ScheduleInterval.js';

/**
 * An adapter object for a Schedule job.
 * Useful for interacting with a job without necessarily knowing its actual
 * type.
 */
export interface ScheduleJobAdapter<Job> {
  /** Pauses this job. */
  pause(): Awaitable<this>;

  /** Resumes this job. */
  resume(): Awaitable<this>;

  /** Destroys this job. */
  destroy(): Awaitable<this>;

  /** Returns the job's execution interval. */
  getInterval(): ScheduleInterval;

  /** Returns whether this job is currently running. */
  isRunning(): boolean;

  /** Returns the raw job object. */
  getRaw(): Job;
}
