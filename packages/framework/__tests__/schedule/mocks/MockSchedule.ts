import type { Metadata, ScheduleFilterResolvable, ScheduleInterval } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';
import { vi } from 'vitest';
import { AbstractSchedule } from '../../../src';

export class MockSchedule extends AbstractSchedule {
  public tick = vi.fn<(meta: Metadata) => Awaitable<void>>();

  protected override readonly interval: ScheduleInterval;

  constructor(
    interval: ScheduleInterval = '*/5 * * * * *',
    filter: ScheduleFilterResolvable | null = null,
  ) {
    super();
    this.interval = interval;
    (this as { filter: ScheduleFilterResolvable | null }).filter = filter;
  }
}
