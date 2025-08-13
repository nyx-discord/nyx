import { FeatureError } from '../../../../errors/FeatureError.js';
import type { MetaCollection } from '../../../../meta/MetaCollection.js';
import type { MiddlewareList } from '../../../../middleware/list/MiddlewareList';
import type { Schedule } from '../../schedule/Schedule.js';
import type { ScheduleMiddlewareResolvable } from '../ScheduleMiddlewareResolvable';

export class UncaughtScheduleMiddlewareError extends FeatureError<Schedule> {
  protected readonly middlewareList: MiddlewareList<ScheduleMiddlewareResolvable>;

  protected readonly meta: MetaCollection;

  constructor(
    error: Error,
    middlewareList: MiddlewareList<ScheduleMiddlewareResolvable>,
    schedule: Schedule,
    meta: MetaCollection,
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

  /** Returns the {@link MetaCollection} passed when executing the middleware. */
  public getMeta(): MetaCollection {
    return this.meta;
  }
}
