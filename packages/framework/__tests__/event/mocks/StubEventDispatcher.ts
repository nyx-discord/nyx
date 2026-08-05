import type { EventDispatcher } from '@nyx-discord/core';
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
