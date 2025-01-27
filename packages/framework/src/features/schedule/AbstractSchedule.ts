import { Collection } from '@discordjs/collection';
import type {
  Identifier,
  MetaCollection,
  NyxBot,
  ReadonlyMetaCollection,
  Schedule,
  ScheduleFilter,
  ScheduleTickMeta,
  UndestroyableScheduleJobAdapter,
} from '@nyx-discord/core';
import { ObjectNotFoundError } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

export abstract class AbstractSchedule implements Schedule {
  protected readonly id: Identifier = Symbol(this.constructor.name);

  protected readonly filter: ScheduleFilter | null = null;

  protected readonly meta: MetaCollection = new Collection<
    Identifier,
    unknown
  >();

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
      const botId = String(bot.getId());

      throw new ObjectNotFoundError(
        `Job for schedule ${scheduleId} not found on bot ${botId}.`,
      );
    }

    return job;
  }

  public getId(): Identifier {
    return this.id;
  }

  public getFilter(): ScheduleFilter | null {
    return this.filter;
  }

  public getInterval(): string | Date {
    return this.interval;
  }

  public getMeta(): ReadonlyMetaCollection {
    return this.meta;
  }

  public onRegister(): void {
    /** Do nothing by default */
  }

  public onUnregister(): void {
    /** Do nothing by default */
  }

  public abstract tick(meta: ScheduleTickMeta): Awaitable<void>;
}
