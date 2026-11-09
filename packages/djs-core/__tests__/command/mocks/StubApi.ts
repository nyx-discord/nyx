import type { API } from '@discordjs/core';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

export class StubApi {
  public static create(overrides?: {
    bulkOverwriteGlobalCommands?: Mock;
    bulkOverwriteGuildCommands?: Mock;
    editGlobalCommand?: Mock;
    editGuildCommand?: Mock;
    deleteGlobalCommand?: Mock;
    deleteGuildCommand?: Mock;
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
