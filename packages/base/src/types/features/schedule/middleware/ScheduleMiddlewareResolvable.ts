import type { MiddlewareResolvableFrom } from '#types/middleware/MiddlewareResolvable';
import type { ScheduleMiddleware } from './ScheduleMiddleware';

export type ScheduleMiddlewareResolvable =
  MiddlewareResolvableFrom<ScheduleMiddleware>;
