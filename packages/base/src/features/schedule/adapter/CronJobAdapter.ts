import type { ScheduleInterval, ScheduleJobAdapter } from '@nyx-discord/types';
import type { Cron } from 'croner';

/** A {@link ScheduleJobAdapter} for a `croner` {@link Cron} job. */
export class CronJobAdapter implements ScheduleJobAdapter<Cron> {
  protected readonly cronjob: Cron;

  protected readonly interval: ScheduleInterval;

  constructor(job: Cron, interval: ScheduleInterval) {
    this.cronjob = job;
    this.interval = interval;
  }

  public isRunning(): boolean {
    return this.cronjob.isRunning();
  }

  public pause(): this {
    this.cronjob.pause();
    return this;
  }

  public resume(): this {
    this.cronjob.resume();
    return this;
  }

  public destroy(): this {
    this.cronjob.stop();
    return this;
  }

  public getInterval(): ScheduleInterval {
    return this.interval;
  }

  public getRaw(): Cron {
    return this.cronjob;
  }
}
