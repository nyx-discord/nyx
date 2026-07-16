import type { AnyEventBus, Identifier } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubEventBus {
  static create(id: Identifier, isProtected = false): AnyEventBus {
    let protected_ = isProtected;
    return {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribeProtected: vi.fn().mockResolvedValue(undefined),
      emit: vi.fn().mockResolvedValue(undefined),
      clearSubscribers: vi.fn().mockResolvedValue(undefined),
      isSubscribed: vi.fn().mockReturnValue(false),
      sortSubscribers: vi.fn(),
      setDispatcher: vi.fn(),
      getDispatcher: vi.fn(),
      getSubscribers: vi.fn(),
      getSubscribedEvents: vi.fn(),
      getMetadataFactory: vi.fn(),
      getId: vi.fn().mockReturnValue(id),
      getMeta: vi.fn().mockReturnValue({}),
      isProtected: vi.fn(() => protected_),
      protect: vi.fn(function (this: any) {
        protected_ = true;
        return this;
      }),
      unprotect: vi.fn(function (this: any) {
        protected_ = false;
        return this;
      }),
      next: vi.fn().mockReturnValue({ done: true, value: undefined }),
      [Symbol.iterator]: vi.fn(function* (this: any) {}),
      values: vi.fn(function* (this: any) {}),
      keys: vi.fn(function* (this: any) {}),
      entries: vi.fn(function* (this: any) {}),
    } as unknown as AnyEventBus;
  }
}
