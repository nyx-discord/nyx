import { NyxBot } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubBot {
  static create(): NyxBot {
    return {
      getLogger: vi.fn().mockReturnValue({ error: vi.fn() }),
    } as unknown as NyxBot;
  }
}
