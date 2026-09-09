import type {
  EventBus,
  Identifier,
  ScheduleEventArgs,
} from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubScheduleEventBus {
  public static create(): EventBus<ScheduleEventArgs> {
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
      getSubscribers: vi.fn().mockReturnValue(subscribers),
      getSubscribedEvents: vi.fn(),
      getMetadataFactory: vi.fn().mockReturnValue({
        addDefaultField: vi.fn(),
        getFields: vi.fn().mockReturnValue([]),
      }),
      getMeta: vi.fn().mockReturnValue({}),
      next: vi.fn().mockReturnValue({ done: true, value: undefined }),
      [Symbol.iterator]: vi.fn(function* () {}),
      values: vi.fn(function* () {}),
      keys: vi.fn(function* () {}),
      entries: vi.fn(function* () {}),
    } as EventBus<ScheduleEventArgs>;
  }
}
