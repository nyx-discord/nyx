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

import type { ReadonlyCollection } from '@discordjs/collection';
import type { Awaitable } from 'discord.js';

import type { Identifier } from '../../../identity/Identifier.js';
import type { BotLifecycleObserver } from '../../../types/BotLifecycleObserver';
import type { ClassImplements } from '../../../types/ClassImplements.js';
import type { Schedule } from '../schedule/Schedule.js';

/** An object responsible for storing schedules. */
export interface ScheduleRepository
  extends BotLifecycleObserver,
    IterableIterator<[Identifier, Schedule]> {
  /** Returns the number of stored schedules. */
  readonly size: number;

  /**
   * Adds a new {@link Schedule}.
   *
   * @throws {IllegalDuplicateError} If a Schedule with that ID is present.
   */
  addSchedule(schedule: Schedule): Awaitable<this>;

  /**
   * Removes a {@link Schedule} by its instance or ID.
   *
   * @throws {ObjectNotFoundError} If a Schedule with that ID is not found.
   */
  removeSchedule(scheduleOrId: Schedule | Identifier): Awaitable<this>;

  /** Returns a {@link Schedule} by its ID. */
  getScheduleByID(id: Identifier): Schedule | null;

  /** Returns the first {@link Schedule} found that is an instance of the given class. */
  getScheduleByClass(
    ScheduleClass: ClassImplements<Schedule>,
  ): InstanceType<typeof ScheduleClass> | null;

  /** Returns whether a {@link Schedule} with the given ID exists. */
  has(id: Identifier): boolean;

  /** Returns all {@link Schedule}s. */
  getSchedules(): ReadonlyCollection<Identifier, Schedule>;

  /** Returns an iterator of all {@link Schedule}s. */
  values(): IterableIterator<Schedule>;

  /** Returns an iterator of all {@link Identifier}s. */
  keys(): IterableIterator<Identifier>;

  /** Returns an iterator of all [{@link Identifier}, {@link Schedule}] pairs. */
  entries(): IterableIterator<[Identifier, Schedule]>;
}
