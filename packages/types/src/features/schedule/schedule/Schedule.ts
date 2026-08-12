import type { Awaitable } from '../../../types/Awaitable.js';
import type { NyxBot } from '../../../bot/NyxBot.js';
import type { Filterable } from '../../../filter/Filterable.js';
import type { Identifiable } from '../../../identity/Identifiable.js';
import type { Metadatable } from '../../../meta/Metadatable.js';
import type { ScheduleTickArgs } from '../execution/args/ScheduleTickArgs.js';
import type { ScheduleFilterResolvable } from '../filter/ScheduleFilterResolvable';
import type { ScheduleInterval } from '../interval/ScheduleInterval.js';
import type { UndestroyableScheduleJobAdapter } from '../job/UndestroyableScheduleJobAdapter.js';

/** An object that is ticked continuously. */
export interface Schedule
  extends Identifiable, Filterable<ScheduleFilterResolvable>, Metadatable {
  /** Runs this schedule. */
  tick(...args: ScheduleTickArgs): Awaitable<void>;

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
