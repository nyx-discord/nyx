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

import type { Awaitable } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { Identifier } from '../../identity/Identifier.js';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { ClassImplements } from '../../types/ClassImplements.js';
import type { EventBus } from '../event/bus/EventBus.js';
import type { ScheduleEventArgs } from './events/ScheduleEvent.js';
import type { ScheduleExecutor } from './execution/executor/ScheduleExecutor.js';
import type { ScheduleTickMeta } from './execution/meta/ScheduleTickMeta.js';
import type { ReadonlyScheduleExecutionScheduler } from './execution/scheduler/ReadonlyScheduleExecutionScheduler.js';
import type { ScheduleJobAdapter } from './job/ScheduleJobAdapter.js';
import type { UndestroyableScheduleJobAdapter } from './job/UndestroyableScheduleJobAdapter.js';
import type { ReadonlyScheduleRepository } from './repository/ReadonlyScheduleRepository.js';
import type { Schedule } from './schedule/Schedule.js';

/** An object that holds methods for interacting with the bot's {@link Schedule schedules}. */
export interface ScheduleManager extends BotLifecycleObserver, BotAware {
  /**
   * Adds a new {@link Schedule}.
   *
   * @throws {IllegalDuplicateError} If a schedule with that ID is registered.
   */
  addSchedule(schedule: Schedule): Awaitable<ScheduleJobAdapter<unknown>>;

  /**
   * Removes a {@link Schedule} by its instance or ID.
   *
   * @throws {ObjectNotFoundError} If the schedule is not currently registered.
   */
  removeSchedule(scheduleOrId: Schedule | Identifier): Awaitable<this>;

  /**
   * Ticks a {@link Schedule} by its instance or ID.
   *
   * @throws {ObjectNotFoundError} If the schedule is not currently registered.
   */
  tick(
    scheduleOrId: Schedule | Identifier,
    meta?: ScheduleTickMeta,
  ): Awaitable<this>;

  /** Returns the job that belongs to the passed schedule or schedule ID. */
  getJobForSchedule(
    scheduleOrId: Schedule | Identifier,
  ): UndestroyableScheduleJobAdapter<unknown> | null;

  /** Returns a {@link Schedule} by its ID. */
  getScheduleByID(id: Identifier): Schedule | null;

  /** Returns the first {@link Schedule} found that is an instance of the given class. */
  getScheduleByClass(
    ScheduleClass: ClassImplements<Schedule>,
  ): InstanceType<typeof ScheduleClass> | null;

  /** Returns the {@link ScheduleExecutor} for this manager. */
  getExecutor(): ScheduleExecutor;

  /** Returns the {@link ScheduleRepository} for this manager. */
  getRepository(): ReadonlyScheduleRepository;

  /** Returns the {@link EventBus} for this manager. */
  getEventBus(): EventBus<ScheduleEventArgs>;

  /** Returns the {@link ScheduleExecutionScheduler} for this manager. */
  getScheduler(): ReadonlyScheduleExecutionScheduler;
}
