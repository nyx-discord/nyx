import type { ScheduleTickArgs } from '#types/features/schedule/execution/args/ScheduleTickArgs';
import type { Schedule } from '#types/features/schedule/schedule/Schedule';
import { AbstractFilter } from '../../../filter/AbstractFilter';

/** A {@link AbstractFilter Filter} for filtering {@link AbstractSchedule Schedule} executions. */
export abstract class AbstractScheduleFilter extends AbstractFilter<
  Schedule,
  ScheduleTickArgs
> {}
