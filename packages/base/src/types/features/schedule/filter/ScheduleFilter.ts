import type { Filter } from '#types/filter/Filter';
import type { ScheduleTickArgs } from '../execution/args/ScheduleTickArgs.js';
import type { Schedule } from '../schedule/Schedule.js';

/** {@link Filter} that can filter an {@link Schedule}'s execution. */
export interface ScheduleFilter extends Filter<Schedule, ScheduleTickArgs> {}
