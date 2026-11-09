import type { Client } from 'discord.js';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

export class StubClient {
  public static create(overrides?: {
    set?: Mock;
    delete?: Mock;
    edit?: Mock;
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
