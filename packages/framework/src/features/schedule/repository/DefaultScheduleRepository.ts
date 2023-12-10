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
import { Collection } from '@discordjs/collection';
import type {
  ClassImplements,
  Identifier,
  Schedule,
  ScheduleRepository,
} from '@nyx-discord/core';
import {
  canBeIdentifier,
  IllegalDuplicateError,
  ObjectNotFoundError,
} from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

export class DefaultScheduleRepository implements ScheduleRepository {
  protected readonly schedules: Collection<Identifier, Schedule> =
    new Collection();

  public static create(): ScheduleRepository {
    return new DefaultScheduleRepository();
  }

  public get size() {
    return this.schedules.size;
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

  public addSchedule(schedule: Schedule, throwIfExists?: boolean): this {
    const presentSchedule = this.schedules.get(schedule.getId());
    if (presentSchedule) {
      if (!throwIfExists) return this;
      throw new IllegalDuplicateError(
        presentSchedule,
        schedule,
        `Schedule with ID ${String(schedule.getId())} already exists.`,
      );
    }

    this.schedules.set(schedule.getId(), schedule);
    return this;
  }

  public getScheduleByClass(
    ScheduleClass: ClassImplements<Schedule>,
  ): InstanceType<typeof ScheduleClass> | null {
    return (
      this.schedules.find((schedule) => schedule instanceof ScheduleClass)
      ?? null
    );
  }

  public getScheduleByID(id: Identifier): Schedule | null {
    return this.schedules.get(id) ?? null;
  }

  public getSchedules(): ReadonlyCollection<Identifier, Schedule> {
    return this.schedules;
  }

  public removeSchedule(
    scheduleOrId: Identifier | Schedule,
    throwIfAbsent?: boolean,
  ): this {
    const scheduleId = canBeIdentifier(scheduleOrId)
      ? scheduleOrId
      : scheduleOrId.getId();

    const presentSchedule = this.schedules.get(scheduleId);
    if (!presentSchedule) {
      if (!throwIfAbsent) return this;
      throw new ObjectNotFoundError(
        `Schedule with ID ${String(scheduleId)} not found.`,
      );
    }

    this.schedules.delete(scheduleId);
    return this;
  }

  public has(id: Identifier): boolean {
    return this.schedules.has(id);
  }

  public *entries(): IterableIterator<[Identifier, Schedule]> {
    for (const [key, item] of this.schedules.entries()) {
      yield [key, item];
    }
  }

  public *keys(): IterableIterator<Identifier> {
    for (const key of this.schedules.keys()) {
      yield key;
    }
  }

  public *values(): IterableIterator<Schedule> {
    for (const item of this.schedules.values()) {
      yield item;
    }
  }

  public next(): IteratorResult<Schedule> {
    return this.values().next();
  }

  public [Symbol.iterator](): IterableIterator<Schedule> {
    return this.values();
  }
}
