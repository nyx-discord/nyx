import type { EventSubscriberMiddleware } from '#types/features/event/middleware/EventSubscriberMiddleware';
import type { MiddlewareResponse } from '#types/middleware/response/MiddlewareResponse';
import type { Priority } from '#types/priority/Priority';
import { PriorityEnum } from '#types/priority/Priority';
import { vi } from 'vitest';

export class StubEventMiddleware {
  public static create(
    response: MiddlewareResponse = { allowed: true, checkNext: true },
    priority: Priority = PriorityEnum.Normal,
  ): EventSubscriberMiddleware {
    return {
      check: vi.fn().mockResolvedValue(response),
      getPriority: vi.fn().mockReturnValue(priority),
      protect: vi.fn(),
      unprotect: vi.fn(),
      isProtected: vi.fn().mockReturnValue(false),
    } as unknown as EventSubscriberMiddleware;
  }
}
