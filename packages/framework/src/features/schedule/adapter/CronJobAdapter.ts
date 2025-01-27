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
