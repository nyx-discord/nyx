import type { CommandErrorHandler } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubErrorHandler {
  public static create(): CommandErrorHandler {
    return {
      handle: vi.fn(),
      setConsumer: vi.fn(),
      removeConsumerOf: vi.fn(),
      hasConsumer: vi.fn().mockReturnValue(false),
      getConsumers: vi.fn(),
      clear: vi.fn(),
      getFallbackConsumer: vi.fn(),
      setFallbackConsumer: vi.fn(),
    } as unknown as CommandErrorHandler;
  }
}
