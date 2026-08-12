import type { Schedule } from '@nyx-discord/types';
import { BasicFilterCheckMiddleware } from '../../../filter/middleware/BasicFilterCheckMiddleware.js';

export class ScheduleFilterCheckMiddleware extends BasicFilterCheckMiddleware<Schedule> {}
