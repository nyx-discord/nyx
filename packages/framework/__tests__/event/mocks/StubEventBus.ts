import type { AnyEventBus } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubEventBus {
  public static create(isProtected = false): AnyEventBus {
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
      getMeta: vi.fn().mockReturnValue({}),
      next: vi.fn().mockReturnValue({ done: true, value: undefined }),
      [Symbol.iterator]: vi.fn(function* (this: any) {}),
      values: vi.fn(function* (this: any) {}),
      keys: vi.fn(function* (this: any) {}),
      entries: vi.fn(function* (this: any) {}),
    } as unknown as AnyEventBus;
  }
}
