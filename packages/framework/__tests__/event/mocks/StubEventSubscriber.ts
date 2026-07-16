import { vi } from 'vitest';

export class StubEventSubscriber {
  static create(overrides: Record<string, unknown> = {}) {
    return {
      getEvent: vi.fn(),
      getId: vi.fn().mockReturnValue(Symbol('sub')),
      getPriority: vi.fn().mockReturnValue(3),
      getLifetime: vi.fn().mockReturnValue('On'),
      handleEvent: vi.fn(),
      onSubscribe: vi.fn(),
      onUnsubscribe: vi.fn(),
      onBusUnregister: vi.fn(),
      ignoresHandledEvents: vi.fn(),
      isProtected: vi.fn(),
      protect: vi.fn(),
      unprotect: vi.fn(),
      getFilter: vi.fn(),
      getMeta: vi.fn(),
      ...overrides,
    };
  }
}
