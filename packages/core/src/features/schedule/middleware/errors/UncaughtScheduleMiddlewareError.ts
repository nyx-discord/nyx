import { FeatureError } from '../../../../errors/FeatureError.js';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import type { ScheduleTickMeta } from '../../execution/meta/ScheduleTickMeta.js';
import type { Schedule } from '../../schedule/Schedule.js';
import type { ScheduleMiddleware } from '../ScheduleMiddleware.js';

export class UncaughtScheduleMiddlewareError extends FeatureError<Schedule> {
  protected readonly middlewareList: MiddlewareList<ScheduleMiddleware>;

  protected readonly meta: ScheduleTickMeta;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<ScheduleMiddleware>,
    schedule: Schedule,
    meta: ScheduleTickMeta,
  ) {
    super(
      error,
      schedule,
      'There was an uncaught error while executing an schedule middleware.',
    );
    this.middlewareList = middlewareList;
    this.meta = meta;
  }

  /** Returns the middleware that threw this error. */
  public getList(): MiddlewareList<ScheduleMiddleware> {
    return this.middlewareList;
  }

  /** Returns the ScheduleTickMeta passed when executing the middleware. */
  public getMeta(): ScheduleTickMeta {
    return this.meta;
  }
}
