import type { MiddlewareResolvableFrom } from '../../../middleware/MiddlewareResolvable';
import type { ScheduleMiddleware } from './ScheduleMiddleware';

export type ScheduleMiddlewareResolvable =
  MiddlewareResolvableFrom<ScheduleMiddleware>;
