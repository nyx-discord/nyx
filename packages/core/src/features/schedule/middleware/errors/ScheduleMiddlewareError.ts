import { FeatureError } from '../../../../errors/FeatureError.js';
import type { Metadata } from '../../../../meta/Metadata';
import type { Schedule } from '../../schedule/Schedule.js';
import type { ScheduleMiddleware } from '../ScheduleMiddleware.js';

export class ScheduleMiddlewareError extends FeatureError<Schedule> {
  protected readonly middleware: ScheduleMiddleware;

  protected readonly meta: Metadata;

  constructor(
    error: Error,
    middleware: ScheduleMiddleware,
    schedule: Schedule,
    meta: Metadata,
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

  /** Returns the {@link Metadata} passed when executing the middleware. */
  public getMeta(): Metadata {
    return this.meta;
  }
}
