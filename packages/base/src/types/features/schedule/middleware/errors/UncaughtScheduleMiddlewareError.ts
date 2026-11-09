import { FeatureError } from '#types/errors/FeatureError';
import type { Metadata } from '#types/meta/Metadata';
import type { MiddlewareList } from '#types/middleware/list/MiddlewareList';
import type { Schedule } from '../../schedule/Schedule.js';
import type { ScheduleMiddlewareResolvable } from '../ScheduleMiddlewareResolvable';

export class UncaughtScheduleMiddlewareError extends FeatureError<Schedule> {
  protected readonly middlewareList: MiddlewareList<ScheduleMiddlewareResolvable>;

  protected readonly meta: Metadata;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<ScheduleMiddlewareResolvable>,
    schedule: Schedule,
    meta: Metadata,
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
  public getList(): MiddlewareList<ScheduleMiddlewareResolvable> {
    return this.middlewareList;
  }

  /** Returns the {@link Metadata} passed when executing the middleware. */
  public getMeta(): Metadata {
    return this.meta;
  }
}
