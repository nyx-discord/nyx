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
