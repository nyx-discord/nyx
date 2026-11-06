import type { ScheduleTickArgs } from '#types/features/schedule/execution/args/ScheduleTickArgs';
import type { ScheduleMiddleware } from '#types/features/schedule/middleware/ScheduleMiddleware';
import type { Schedule } from '#types/features/schedule/schedule/Schedule';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware';

export abstract class AbstractScheduleMiddleware
  extends AbstractMiddleware<Schedule, ScheduleTickArgs>
  implements ScheduleMiddleware {}
