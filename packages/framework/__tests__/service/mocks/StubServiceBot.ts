import { vi } from 'vitest';

export class StubServiceBot {
  static create() {
    return {
      getScheduleManager: vi.fn().mockReturnValue({
        onStart: vi.fn().mockResolvedValue(undefined),
        onStop: vi.fn(),
      }),
      getPluginManager: vi.fn().mockReturnValue({
        onStart: vi.fn().mockResolvedValue(undefined),
        onStop: vi.fn(),
      }),
      getCommandManager: vi.fn().mockReturnValue({
        onStart: vi.fn().mockResolvedValue(undefined),
        onStop: vi.fn(),
      }),
      getClient: vi.fn().mockReturnValue({
        login: vi.fn().mockResolvedValue('token'),
        destroy: vi.fn(),
      }),
      getLogger: vi.fn().mockReturnValue({
        error: vi.fn(),
      }),
      getToken: vi.fn().mockReturnValue('test-token'),
    };
  }
}
