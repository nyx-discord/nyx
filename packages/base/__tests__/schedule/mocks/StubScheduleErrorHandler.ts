import type { ScheduleErrorHandler } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubScheduleErrorHandler {
  public static create(): ScheduleErrorHandler {
    return {
      handle: vi.fn(),
      setConsumer: vi.fn(),
      removeConsumerOf: vi.fn(),
      hasConsumer: vi.fn().mockReturnValue(false),
      getConsumers: vi.fn(),
      clear: vi.fn(),
      getFallbackConsumer: vi.fn(),
      setFallbackConsumer: vi.fn(),
    } as unknown as ScheduleErrorHandler;
  }
}
