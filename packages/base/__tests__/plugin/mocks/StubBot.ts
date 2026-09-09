import { NyxBot } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubBot {
  public static create(): NyxBot {
    return {
      getLogger: vi.fn().mockReturnValue({ error: vi.fn() }),
    } as unknown as NyxBot;
  }
}
