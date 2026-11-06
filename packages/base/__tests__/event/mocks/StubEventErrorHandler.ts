import type { EventSubscriberErrorHandler } from '#types/features/event/subscriber/error/EventSubscriberErrorHandler';
import { vi } from 'vitest';

export class StubEventErrorHandler {
  public static create(): EventSubscriberErrorHandler {
    return {
      handle: vi.fn(),
    } as unknown as EventSubscriberErrorHandler;
  }
}
