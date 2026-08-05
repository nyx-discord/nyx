import type {
  EventBus,
  Identifier,
  ScheduleEventArgs,
} from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubScheduleEventBus {
  public static create(
    id: Identifier = Symbol('stub-bus'),
  ): EventBus<ScheduleEventArgs> {
    const subscribers = new Map<Identifier, unknown>();
    return {
      subscribe: vi
        .fn()
        .mockImplementation((subscriber: { getId: () => Identifier }) => {
          subscribers.set(subscriber.getId(), subscriber);
          return Promise.resolve();
        }),
      unsubscribe: vi.fn(),
      unsubscribeProtected: vi.fn(),
      emit: vi.fn().mockResolvedValue(undefined),
      clearSubscribers: vi.fn(),
      isSubscribed: vi
        .fn()
        .mockImplementation((subscriber: { getId: () => Identifier }) =>
          subscribers.has(subscriber.getId()),
        ),
      sortSubscribers: vi.fn(),
      setDispatcher: vi.fn(),
      getDispatcher: vi.fn(),
      getSubscribers: vi.fn(),
      getSubscribedEvents: vi.fn(),
      getMetadataFactory: vi.fn(),
      getId: vi.fn().mockReturnValue(id),
      getMeta: vi.fn().mockReturnValue({}),
      isProtected: vi.fn().mockReturnValue(false),
      protect: vi.fn(),
      unprotect: vi.fn(),
      next: vi.fn().mockReturnValue({ done: true, value: undefined }),
      [Symbol.iterator]: vi.fn(function* () {}),
      values: vi.fn(function* () {}),
      keys: vi.fn(function* () {}),
      entries: vi.fn(function* () {}),
    } as unknown as EventBus<ScheduleEventArgs>;
  }
}
