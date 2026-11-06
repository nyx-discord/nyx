import type { NyxBot } from '#types/bot/NyxBot';
import type { Filterable } from '#types/filter/Filterable';
import type { Identifiable } from '#types/identity/Identifiable';
import type { Metadatable } from '#types/meta/Metadatable';
import type { Awaitable } from '#types/types/Awaitable';
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
