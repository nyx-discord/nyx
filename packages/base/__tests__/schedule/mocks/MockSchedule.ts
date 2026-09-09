import type { Awaitable, Metadata, ScheduleFilterResolvable } from '@nyx-discord/types';
import { vi } from 'vitest';
import { AbstractSchedule } from '../../../src';

export class MockSchedule extends AbstractSchedule {
  public tick = vi.fn<(meta: Metadata) => Awaitable<void>>();

  protected override readonly interval: string | Date;

  constructor(
    interval: string | Date = '*/5 * * * * *',
    filter: ScheduleFilterResolvable | null = null,
  ) {
    super();
    this.interval = interval;
    (this as any).filter = filter;
  }
}
