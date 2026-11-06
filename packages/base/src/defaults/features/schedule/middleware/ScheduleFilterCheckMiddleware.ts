import type { Schedule } from '#types/features/schedule/schedule/Schedule';
import { BasicFilterCheckMiddleware } from '../../../filter/middleware/BasicFilterCheckMiddleware';

export class ScheduleFilterCheckMiddleware extends BasicFilterCheckMiddleware<Schedule> {}
