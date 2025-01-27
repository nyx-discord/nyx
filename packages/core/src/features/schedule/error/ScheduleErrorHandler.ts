import type { ErrorHandler } from '../../../error/handler/ErrorHandler.js';
import type { ScheduleTickArgs } from '../execution/args/ScheduleTickArgs.js';
import type { Schedule } from '../schedule/Schedule.js';

export interface ScheduleErrorHandler
  extends ErrorHandler<Schedule, ScheduleTickArgs> {}
