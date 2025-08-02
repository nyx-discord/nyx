import { FeatureError } from '../../../../errors/FeatureError.js';
import { MetaCollection } from '../../../../meta/MetaCollection.js';
import type { Schedule } from '../../schedule/Schedule.js';
import type { ScheduleMiddleware } from '../ScheduleMiddleware.js';

export class ScheduleMiddlewareError extends FeatureError<Schedule> {
  protected readonly middleware: ScheduleMiddleware;

  protected readonly meta: MetaCollection;

  constructor(
    error: Error,
    middleware: ScheduleMiddleware,
    schedule: Schedule,
    meta: MetaCollection,
  ) {
    super(
      error,
      schedule,
      'There was an error while executing an schedule middleware.',
    );
    this.middleware = middleware;
    this.meta = meta;
  }

  /** Returns the middleware that threw this error. */
  public getMiddleware(): ScheduleMiddleware {
    return this.middleware;
  }

  /** Returns the {@link MetaCollection} passed when executing the middleware. */
  public getMeta(): MetaCollection {
    return this.meta;
  }
}
