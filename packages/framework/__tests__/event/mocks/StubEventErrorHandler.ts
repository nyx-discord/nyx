import type { EventSubscriberErrorHandler } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubEventErrorHandler {
  static create(): EventSubscriberErrorHandler {
    return {
      handle: vi.fn(),
    } as unknown as EventSubscriberErrorHandler;
  }
}
