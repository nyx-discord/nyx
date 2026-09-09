import type { ScheduleFilter } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubScheduleFilter {
  public static create(allowed = true): ScheduleFilter {
    return {
      check: vi.fn().mockResolvedValue(allowed),
    } as unknown as ScheduleFilter;
  }
}
