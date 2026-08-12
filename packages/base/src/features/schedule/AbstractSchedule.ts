import type {
  Identifier,
  Metadata,
  NyxBot,
  ReadonlyMetadata,
  Schedule,
  ScheduleFilterResolvable,
  UndestroyableScheduleJobAdapter,
} from '@nyx-discord/types';
import { ObjectNotFoundError } from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';

export abstract class AbstractSchedule implements Schedule {
  protected readonly id: Identifier = Symbol(this.constructor.name);

  protected readonly filter: ScheduleFilterResolvable | null = null;

  protected readonly meta: Metadata = Object.create(null);

  protected abstract readonly interval: string | Date;

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

  public getInterval(): string | Date {
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
