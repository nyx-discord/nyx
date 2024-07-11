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
