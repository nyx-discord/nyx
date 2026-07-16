import type { EventSubscriberMiddleware, MiddlewareList } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubEventMiddlewareList {
  static create(checkResult = true): MiddlewareList<EventSubscriberMiddleware> {
    return {
      check: vi.fn().mockResolvedValue(checkResult),
      add: vi.fn(),
      clear: vi.fn(),
      remove: vi.fn(),
      getMiddlewares: vi.fn(),
    } as unknown as MiddlewareList<EventSubscriberMiddleware>;
  }
}
