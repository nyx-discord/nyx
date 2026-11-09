import { ScheduleMiddlewareError } from '#types/features/schedule/middleware/errors/ScheduleMiddlewareError';
import type { ScheduleMiddleware } from '#types/features/schedule/middleware/ScheduleMiddleware';
import type { MiddlewareList } from '#types/middleware/list/MiddlewareList';
import type { Tail } from '#types/types/Tail';
import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';
import { ScheduleFilterCheckMiddleware } from './ScheduleFilterCheckMiddleware';

export class ScheduleMiddlewareList extends AbstractMiddlewareList<ScheduleMiddleware> {
  public static create(): MiddlewareList<ScheduleMiddleware> {
    const filterMiddleware = new ScheduleFilterCheckMiddleware();
    return new this().add(filterMiddleware);
  }

  /** Wraps a generic error in a {@link ScheduleMiddlewareError}. */
  protected wrapError(
    erroredMiddleware: ScheduleMiddleware,
    error: Error,
    schedule: Parameters<ScheduleMiddleware['check']>[0],
    ...args: Tail<Parameters<ScheduleMiddleware['check']>>
  ): Error {
    const [meta] = args;
    return new ScheduleMiddlewareError(
      error,
      erroredMiddleware,
      schedule,
      meta,
    );
  }
}
