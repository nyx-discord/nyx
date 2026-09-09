import type {
  MiddlewareResponse,
  Priority,
  ScheduleMiddleware,
} from '@nyx-discord/types';
import { PriorityEnum } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubScheduleMiddleware {
  public static create(
    response: MiddlewareResponse = { allowed: true, checkNext: true },
    priority: Priority = PriorityEnum.Normal,
  ): ScheduleMiddleware {
    return {
      check: vi.fn().mockResolvedValue(response),
      getPriority: vi.fn().mockReturnValue(priority),
      protect: vi.fn(),
      unprotect: vi.fn(),
      isProtected: vi.fn().mockReturnValue(false),
    } as unknown as ScheduleMiddleware;
  }
}
