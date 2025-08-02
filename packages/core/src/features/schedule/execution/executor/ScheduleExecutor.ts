import type { Awaitable } from 'discord.js';
import type { ErrorHandlerContainer } from '../../../../error/handler/ErrorHandlerContainer.js';
import { MetaCollection } from '../../../../meta/MetaCollection.js';
import type { MiddlewareListContainer } from '../../../../middleware/list/MiddlewareListContainer.js';
import type { ScheduleErrorHandler } from '../../error/ScheduleErrorHandler.js';
import type { ScheduleMiddleware } from '../../middleware/ScheduleMiddleware.js';
import type { Schedule } from '../../schedule/Schedule.js';

export interface ScheduleExecutor
  extends MiddlewareListContainer<ScheduleMiddleware>,
    ErrorHandlerContainer<ScheduleErrorHandler> {
  /** Ticks a {@link Schedule}. */
  tick(schedule: Schedule, meta: MetaCollection): Awaitable<void>;
}
