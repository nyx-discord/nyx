import type { Middleware } from '#types/middleware/Middleware';
import type { ScheduleTickArgs } from '../execution/args/ScheduleTickArgs.js';
import type { Schedule } from '../schedule/Schedule.js';

export interface ScheduleMiddleware extends Middleware<
  Schedule,
  ScheduleTickArgs
> {}
