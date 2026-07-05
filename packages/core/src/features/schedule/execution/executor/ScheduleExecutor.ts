import type { Awaitable } from 'discord.js';
import type { ErrorHandlerContainer } from '../../../../error/handler/ErrorHandlerContainer.js';
import type { Metadata } from '../../../../meta/Metadata';
import type { MiddlewareListContainer } from '../../../../middleware/list/MiddlewareListContainer.js';
import type { ScheduleErrorHandler } from '../../error/ScheduleErrorHandler.js';
import type { ScheduleMiddlewareResolvable } from '../../middleware/ScheduleMiddlewareResolvable';
import type { Schedule } from '../../schedule/Schedule.js';

export interface ScheduleExecutor
  extends MiddlewareListContainer<ScheduleMiddlewareResolvable>,
    ErrorHandlerContainer<ScheduleErrorHandler> {
  /** Ticks a {@link Schedule}. */
  tick(schedule: Schedule, meta: Metadata): Awaitable<void>;
}
