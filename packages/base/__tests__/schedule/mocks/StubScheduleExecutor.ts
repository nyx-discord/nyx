import type { ScheduleExecutor } from '../../../src';
import { vi } from 'vitest';

export class StubScheduleExecutor {
  public static create(): ScheduleExecutor {
    return {
      tick: vi.fn(),
      getMiddleware: vi.fn(),
      getErrorHandler: vi.fn(),
    } as unknown as ScheduleExecutor;
  }
}
