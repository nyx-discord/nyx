import type {
  MiddlewareList,
  ScheduleMiddleware,
  Tail,
} from '@nyx-discord/types';
import { ScheduleMiddlewareError } from '@nyx-discord/types';
import { AbstractMiddlewareList } from '../../../middleware/AbstractMiddlewareList';
import { ScheduleFilterCheckMiddleware } from './ScheduleFilterCheckMiddleware.js';

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
