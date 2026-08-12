import type { Schedule } from '../schedule/Schedule.js';

/** Enum of possible schedule events. */
export const ScheduleEventEnum = {
  /** Emitted when a schedule is added. */
  ScheduleAdd: 'scheduleAdd',
  /** Emitted when a schedule is removed. */
  ScheduleRemove: 'scheduleRemove',
} as const satisfies Record<string, keyof ScheduleEventArgs>;

/** Type of values of {@link ScheduleEventEnum}. */
export type ScheduleEvent =
  (typeof ScheduleEventEnum)[keyof typeof ScheduleEventEnum];

/** Record of arguments for each schedule event. */
export interface ScheduleEventArgs {
  scheduleAdd: [schedule: Schedule];
  scheduleRemove: [schedule: Schedule];
}
