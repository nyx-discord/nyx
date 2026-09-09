import type { API } from '@discordjs/core';
import { vi } from 'vitest';

export class StubApi {
  public static create(overrides?: {
    bulkOverwriteGlobalCommands?: ReturnType<typeof vi.fn>;
    bulkOverwriteGuildCommands?: ReturnType<typeof vi.fn>;
    editGlobalCommand?: ReturnType<typeof vi.fn>;
    editGuildCommand?: ReturnType<typeof vi.fn>;
    deleteGlobalCommand?: ReturnType<typeof vi.fn>;
    deleteGuildCommand?: ReturnType<typeof vi.fn>;
  }) {
    const appCommands = {
      bulkOverwriteGlobalCommands:
        overrides?.bulkOverwriteGlobalCommands ?? vi.fn().mockResolvedValue([]),
      bulkOverwriteGuildCommands:
        overrides?.bulkOverwriteGuildCommands ?? vi.fn().mockResolvedValue([]),
      editGlobalCommand:
        overrides?.editGlobalCommand ?? vi.fn().mockResolvedValue({}),
      editGuildCommand:
        overrides?.editGuildCommand ?? vi.fn().mockResolvedValue({}),
      deleteGlobalCommand:
        overrides?.deleteGlobalCommand ?? vi.fn().mockResolvedValue(undefined),
      deleteGuildCommand:
        overrides?.deleteGuildCommand ?? vi.fn().mockResolvedValue(undefined),
    };

    return {
      api: { applicationCommands: appCommands } as unknown as API,
      appCommands,
    };
  }
}
