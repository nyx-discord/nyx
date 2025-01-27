import type { Awaitable } from 'discord.js';

import type { BotAware } from '../../bot/BotAware.js';
import type { Identifier } from '../../identity/Identifier.js';
import type { BotLifecycleObserver } from '../../types/BotLifecycleObserver';
import type { ClassImplements } from '../../types/ClassImplements.js';
import type { EventBus } from '../event/bus/EventBus.js';
import type { EventSubscriber } from '../event/subscriber/EventSubscriber';
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

  /**
   * Subscribes a list of event subscribers to the manager's bus.
   *
   * Alias of:
   * ```
   * const managerBus = scheduleManager.getEventBus();
   * await managerBus.subscribe(subscriber);
   * ```
   */
  subscribe(
    ...subscribers: EventSubscriber<
      ScheduleEventArgs,
      keyof ScheduleEventArgs
    >[]
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
