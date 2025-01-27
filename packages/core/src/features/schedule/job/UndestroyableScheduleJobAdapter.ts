import type { ScheduleJobAdapter } from './ScheduleJobAdapter.js';

/** Type of undestroyable {@link ScheduleJobAdapter}. */
export interface UndestroyableScheduleJobAdapter<Job>
  extends Omit<ScheduleJobAdapter<Job>, 'destroy'> {}
