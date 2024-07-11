/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
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
