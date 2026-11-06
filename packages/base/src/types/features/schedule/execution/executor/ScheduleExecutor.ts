import type { ErrorHandlerContainer } from '#types/error/handler/ErrorHandlerContainer';
import type { Metadata } from '#types/meta/Metadata';
import type { MiddlewareListContainer } from '#types/middleware/list/MiddlewareListContainer';
import type { Awaitable } from '#types/types/Awaitable';
import type { ScheduleErrorHandler } from '../../error/ScheduleErrorHandler.js';
import type { ScheduleMiddlewareResolvable } from '../../middleware/ScheduleMiddlewareResolvable';
import type { Schedule } from '../../schedule/Schedule.js';

export interface ScheduleExecutor
  extends
    MiddlewareListContainer<ScheduleMiddlewareResolvable>,
    ErrorHandlerContainer<ScheduleErrorHandler> {
  /** Ticks a {@link Schedule}. */
  tick(schedule: Schedule, meta: Metadata): Awaitable<void>;
}
