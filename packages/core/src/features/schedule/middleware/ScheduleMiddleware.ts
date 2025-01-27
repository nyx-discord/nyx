import type { Middleware } from '../../../middleware/Middleware.js';
import type { ScheduleTickArgs } from '../execution/args/ScheduleTickArgs.js';
import type { Schedule } from '../schedule/Schedule.js';

export interface ScheduleMiddleware
  extends Middleware<Schedule, ScheduleTickArgs> {}
