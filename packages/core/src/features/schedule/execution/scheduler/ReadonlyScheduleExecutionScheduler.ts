import type { ScheduleExecutionScheduler } from './ScheduleExecutionScheduler.js';

/** Type of immutable {@link ScheduleExecutionScheduler}. */
export interface ReadonlyScheduleExecutionScheduler
  extends Omit<ScheduleExecutionScheduler, 'start' | 'destroy'> {}
