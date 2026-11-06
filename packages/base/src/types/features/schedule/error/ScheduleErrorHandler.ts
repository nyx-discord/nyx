import type { ErrorHandler } from '#types/error/handler/ErrorHandler';
import type { ScheduleTickArgs } from '../execution/args/ScheduleTickArgs.js';
import type { Schedule } from '../schedule/Schedule.js';

export interface ScheduleErrorHandler extends ErrorHandler<
  Schedule,
  ScheduleTickArgs
> {}
