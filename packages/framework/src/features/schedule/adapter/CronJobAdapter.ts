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

import type { ScheduleInterval, ScheduleJobAdapter } from '@nyx-discord/core';
import type { CronJob } from 'cron';

export class CronJobAdapter implements ScheduleJobAdapter<CronJob> {
  protected readonly cronjob: CronJob;

  protected readonly interval: ScheduleInterval;

  constructor(job: CronJob, interval: ScheduleInterval) {
    this.cronjob = job;
    this.interval = interval;
  }

  public isRunning(): boolean {
    return this.cronjob.running;
  }

  public pause(): this {
    this.cronjob.stop();
    return this;
  }

  public resume(): this {
    this.cronjob.start();
    return this;
  }

  public destroy(): this {
    this.cronjob.stop();
    return this;
  }

  public getInterval(): ScheduleInterval {
    return this.interval;
  }

  public getRaw(): CronJob {
    return this.cronjob;
  }
}
