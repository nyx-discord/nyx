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
