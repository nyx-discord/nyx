import type {
  Schedule,
  ScheduleMiddleware,
  ScheduleTickArgs,
} from '@nyx-discord/types';
import { AbstractMiddleware } from '../../../middleware/AbstractMiddleware.js';

export abstract class AbstractScheduleMiddleware
  extends AbstractMiddleware<Schedule, ScheduleTickArgs>
  implements ScheduleMiddleware {}
