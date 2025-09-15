import type {
  MetaCollection,
  MiddlewareList,
  Schedule,
  ScheduleErrorHandler,
  ScheduleExecutor,
  ScheduleMiddlewareResolvable,
  ScheduleTickArgs,
} from '@nyx-discord/core';
import {
  ScheduleMiddlewareError,
  TypedFields,
  UncaughtScheduleMiddlewareError,
} from '@nyx-discord/core';
import { BasicErrorHandler } from '../../../../error/BasicErrorHandler.js';
import { ScheduleMiddlewareList } from '../../middleware/ScheduleMiddlewareList.js';

export class DefaultScheduleExecutor implements ScheduleExecutor {
  protected readonly middleware: MiddlewareList<ScheduleMiddlewareResolvable>;

  protected readonly errorHandler: ScheduleErrorHandler;

  constructor(
    middleware: MiddlewareList<ScheduleMiddlewareResolvable>,
    errorHandler: ScheduleErrorHandler,
  ) {
    this.middleware = middleware;
    this.errorHandler = errorHandler;
  }

  public static create(): ScheduleExecutor {
    return new this(
      ScheduleMiddlewareList.create(),
      BasicErrorHandler.createWithFallbackLogger((_error, _sub, [meta]) =>
        TypedFields.Bot.get(meta, true).getLogger(),
      ),
    );
  }

  public async tick(schedule: Schedule, meta: MetaCollection): Promise<void> {
    const args: ScheduleTickArgs = [meta];

    try {
      await this.checkMiddleware(schedule, args);
    } catch (error) {
      const wrapped = this.wrapMiddlewareError(error as Error, schedule, args);
      await this.errorHandler.handle(wrapped, schedule, args);
    }

    try {
      await schedule.tick(...args);
    } catch (error) {
      await this.errorHandler.handle(error as object, schedule, args);
    }
  }

  public getMiddleware(): MiddlewareList<ScheduleMiddlewareResolvable> {
    return this.middleware;
  }

  public getErrorHandler(): ScheduleErrorHandler {
    return this.errorHandler;
  }

  protected async checkMiddleware(
    schedule: Schedule,
    args: ScheduleTickArgs,
  ): Promise<boolean> {
    let result;
    try {
      result = await this.middleware.check(schedule, ...args);
    } catch (error) {
      const wrappedError = this.wrapMiddlewareError(
        error as Error,
        schedule,
        args,
      );

      await this.errorHandler.handle(wrappedError, schedule, args);
      return false;
    }
    return result;
  }

  /**
   * Wraps a middleware error in an {@link UncaughtScheduleMiddlewareError} if
   * it isn't an {@link ScheduleMiddlewareError}.
   */
  protected wrapMiddlewareError(
    error: Error,
    schedule: Schedule,
    args: ScheduleTickArgs,
  ) {
    if (error instanceof ScheduleMiddlewareError) {
      return error;
    }

    const [meta] = args;

    return new UncaughtScheduleMiddlewareError(
      error,
      this.middleware,
      schedule,
      meta,
    );
  }
}
