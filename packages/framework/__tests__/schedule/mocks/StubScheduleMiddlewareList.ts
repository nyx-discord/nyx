import type {
  MiddlewareList,
  ScheduleMiddlewareResolvable,
} from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubScheduleMiddlewareList {
  public static create(
    checkResult = true,
  ): MiddlewareList<ScheduleMiddlewareResolvable> {
    return {
      check: vi.fn().mockResolvedValue(checkResult),
      add: vi.fn(),
      clear: vi.fn(),
      remove: vi.fn(),
      getMiddlewares: vi.fn(),
    } as unknown as MiddlewareList<ScheduleMiddlewareResolvable>;
  }
}
