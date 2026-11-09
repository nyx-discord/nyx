import type {
  Awaitable,
  Metadata,
  ScheduleFilterResolvable,
  ScheduleInterval,
} from '../../../src';
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
    (this as any).filter = filter;
  }
}
