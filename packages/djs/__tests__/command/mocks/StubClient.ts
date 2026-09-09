import type { Client } from 'discord.js';
import { vi } from 'vitest';

export class StubClient {
  public static create(overrides?: {
    set?: ReturnType<typeof vi.fn>;
    delete?: ReturnType<typeof vi.fn>;
    edit?: ReturnType<typeof vi.fn>;
  }) {
    const cmdMgr = {
      set: overrides?.set ?? vi.fn(),
      delete: overrides?.delete ?? vi.fn(),
      edit: overrides?.edit ?? vi.fn(),
    };
    return {
      client: { application: { commands: cmdMgr } } as unknown as Client,
      cmdMgr,
    };
  }
}
