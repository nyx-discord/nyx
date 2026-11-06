import type { EventDispatcher } from '#types/features/event/dispatch/dispatcher/EventDispatcher';
import { vi } from 'vitest';

export class StubEventDispatcher {
  public static create(): EventDispatcher {
    return {
      dispatch: vi.fn(),
      getErrorHandler: vi.fn(),
      getMiddleware: vi.fn(),
    } as unknown as EventDispatcher;
  }
}
