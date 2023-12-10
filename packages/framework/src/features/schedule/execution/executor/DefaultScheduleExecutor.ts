/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type {
  MiddlewareLinkedList,
  Schedule,
  ScheduleErrorHandler,
  ScheduleExecutor,
  ScheduleMiddleware,
  ScheduleTickArgs,
  ScheduleTickMeta,
} from '@nyx-discord/core';
import {
  ScheduleMiddlewareError,
  UncaughtScheduleMiddlewareError,
} from '@nyx-discord/core';

import { BasicErrorHandler } from '../../../../error/BasicErrorHandler.js';
import { ScheduleMiddlewareLinkedList } from '../../middleware/ScheduleMiddlewareLinkedList.js';

export class DefaultScheduleExecutor implements ScheduleExecutor {
  protected readonly middleware: MiddlewareLinkedList<ScheduleMiddleware>;

  protected readonly errorHandler: ScheduleErrorHandler;

  constructor(
    middleware: MiddlewareLinkedList<ScheduleMiddleware>,
    errorHandler: ScheduleErrorHandler,
  ) {
    this.middleware = middleware;
    this.errorHandler = errorHandler;
  }

  public static create(): ScheduleExecutor {
    const middleware = ScheduleMiddlewareLinkedList.create();
    const errorHandler = new BasicErrorHandler<Schedule, ScheduleTickArgs>();

    return new DefaultScheduleExecutor(middleware, errorHandler);
  }

  public async tick(schedule: Schedule, meta: ScheduleTickMeta): Promise<void> {
    const args: ScheduleTickArgs = [meta];

    try {
      await this.checkMiddleware(schedule, args);
    } catch (error) {
      const wrapped = this.wrapMiddlewareError(error as Error, schedule, args);

      const bot = meta.getBot();
      await this.errorHandler.handle(wrapped, schedule, args, bot);
    }

    try {
      await schedule.tick(...args);
    } catch (error) {
      const bot = meta.getBot();
      await this.errorHandler.handle(error as object, schedule, args, bot);
    }
  }

  public getMiddleware(): MiddlewareLinkedList<ScheduleMiddleware> {
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
      result = await this.middleware.check(schedule, args);
    } catch (error) {
      const wrappedError = this.wrapMiddlewareError(
        error as Error,
        schedule,
        args,
      );

      const bot = args[0].getBot();
      await this.errorHandler.handle(wrappedError, schedule, args, bot);
      return false;
    }
    return result;
  }

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
