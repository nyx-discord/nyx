import type { AnyEventBus } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubEventBus {
  public static create(): AnyEventBus {
    const subscribers = new Map<any, any>();
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
      getSubscribers: vi.fn().mockReturnValue(subscribers),
      getSubscribedEvents: vi.fn().mockReturnValue(new Map()),
      getMetadataFactory: vi.fn().mockReturnValue({
        addDefaultField: vi.fn(),
        getFields: vi.fn().mockReturnValue([]),
      }),
      getMeta: vi.fn().mockReturnValue({}),
      next: vi.fn().mockReturnValue({ done: true, value: undefined }),
      [Symbol.iterator]: vi.fn(function* (this: any) {}),
      values: vi.fn(function* (this: any) {}),
      keys: vi.fn(function* (this: any) {}),
      entries: vi.fn(function* (this: any) {}),
    } as unknown as AnyEventBus;
  }
}
