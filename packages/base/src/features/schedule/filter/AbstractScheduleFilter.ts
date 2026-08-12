import type { Schedule, ScheduleTickArgs } from '@nyx-discord/types';
import { AbstractFilter } from '../../../filter/AbstractFilter.js';

/** A {@link AbstractFilter Filter} for filtering {@link AbstractSchedule Schedule} executions. */
export abstract class AbstractScheduleFilter extends AbstractFilter<
  Schedule,
  ScheduleTickArgs
> {}
