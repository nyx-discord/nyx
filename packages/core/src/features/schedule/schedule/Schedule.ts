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
import type { NyxBot } from '../../../bot/NyxBot.js';
import type { Filterable } from '../../../filter/Filterable.js';
import type { Identifiable } from '../../../identity/Identifiable.js';
import type { Metadatable } from '../../../meta/Metadatable.js';
import type { ScheduleTickArgs } from '../execution/args/ScheduleTickArgs.js';
import type { ScheduleFilter } from '../filter/ScheduleFilter.js';
import type { ScheduleInterval } from '../interval/ScheduleInterval.js';
import type { UndestroyableScheduleJobAdapter } from '../job/UndestroyableScheduleJobAdapter.js';

/** An object that is ticked continuously. */
export interface Schedule
  extends Identifiable,
    Filterable<ScheduleFilter>,
    Metadatable {
  /** Runs this schedule. */
  tick(...args: ScheduleTickArgs): Awaitable<void>;

  /** Called when the schedule is registered on a {@link ScheduleRepository}. */
  onRegister(bot: NyxBot): Awaitable<void>;

  /** Called when the schedule is unregistered from a {@link ScheduleRepository}. */
  onUnregister(bot: NyxBot): Awaitable<void>;

  /** Returns this schedule's execution interval. */
  getInterval(): ScheduleInterval;

  /** Returns this Schedule's job on a given bot. */
  getJob(bot: NyxBot, force?: true): UndestroyableScheduleJobAdapter<unknown>;

  getJob(
    bot: NyxBot,
    force: false,
  ): UndestroyableScheduleJobAdapter<unknown> | null;

  getJob(
    bot: NyxBot,
    force?: boolean,
  ): UndestroyableScheduleJobAdapter<unknown> | null;
}
