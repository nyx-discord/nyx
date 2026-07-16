import type { NyxPlugin, NyxPluginData } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubPlugin implements NyxPlugin {
  readonly id: symbol;
  onRegister = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  onUnregister = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  getData = vi.fn<() => NyxPluginData>().mockReturnValue({ name: 'stub', description: 'stub' });
  getId = vi.fn<() => symbol>();

  constructor(id = Symbol('plugin')) {
    this.id = id;
    this.getId.mockReturnValue(id);
  }
}
