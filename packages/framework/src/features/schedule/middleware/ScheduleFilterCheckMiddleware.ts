import type { Schedule } from '@nyx-discord/core';
import { BasicFilterCheckMiddleware } from '../../../filter/middleware/BasicFilterCheckMiddleware.js';

export class ScheduleFilterCheckMiddleware extends BasicFilterCheckMiddleware<Schedule> {}
