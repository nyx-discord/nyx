import type { NyxBot } from '#types/bot/NyxBot';
import { ObjectNotFoundError } from '#types/errors/ObjectNotFoundError';
import type { ScheduleFilterResolvable } from '#types/features/schedule/filter/ScheduleFilterResolvable';
import type { ScheduleInterval } from '#types/features/schedule/interval/ScheduleInterval';
import type { UndestroyableScheduleJobAdapter } from '#types/features/schedule/job/UndestroyableScheduleJobAdapter';
import type { Schedule } from '#types/features/schedule/schedule/Schedule';
import type { Identifier } from '#types/identity/Identifier';
import type { Metadata } from '#types/meta/Metadata';
import type { ReadonlyMetadata } from '#types/meta/ReadonlyMetadata';
import type { Awaitable } from '#types/types/Awaitable';

export abstract class AbstractSchedule implements Schedule {
  protected readonly id: Identifier = Symbol(this.constructor.name);

  protected readonly filter: ScheduleFilterResolvable | null = null;

  protected readonly meta: Metadata = Object.create(null);

  protected abstract readonly interval: ScheduleInterval;

  public getJob(
    bot: NyxBot,
    force?: true,
  ): UndestroyableScheduleJobAdapter<unknown>;
  public getJob(
    bot: NyxBot,
    force: false,
  ): UndestroyableScheduleJobAdapter<unknown> | null;
  public getJob(
    bot: NyxBot,
    force = true,
  ): UndestroyableScheduleJobAdapter<unknown> | null {
    const job = bot.getScheduleManager().getJobForSchedule(this);
    if (!job && force) {
      const scheduleId = String(this.id);
      throw new ObjectNotFoundError(
        `Job for schedule ${scheduleId} not found.`,
      );
    }

    return job;
  }

  public getId(): Identifier {
    return this.id;
  }

  public getFilter(): ScheduleFilterResolvable | null {
    return this.filter;
  }

  public getInterval(): ScheduleInterval {
    return this.interval;
  }

  public getMeta(): ReadonlyMetadata {
    return this.meta;
  }

  public onRegister(): void {
    /** Do nothing by default */
  }

  public onUnregister(): void {
    /** Do nothing by default */
  }

  public abstract tick(meta: Metadata): Awaitable<void>;
}
