import type { EventSubscriberErrorHandler } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubEventErrorHandler {
  public static create(): EventSubscriberErrorHandler {
    return {
      handle: vi.fn(),
    } as unknown as EventSubscriberErrorHandler;
  }
}
