import type { NyxPluginData } from '#types/features/plugin/data/NyxPluginData';
import type { NyxPlugin } from '#types/features/plugin/plugin/NyxPlugin';
import { vi } from 'vitest';

export class StubPlugin implements NyxPlugin {
  public readonly id: symbol;

  public onRegister = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  public onUnregister = vi
    .fn<() => Promise<void>>()
    .mockResolvedValue(undefined);

  public getData = vi
    .fn<() => NyxPluginData>()
    .mockReturnValue({ name: 'stub', description: 'stub' });

  public getId = vi.fn<() => symbol>();

  constructor(id = Symbol('plugin')) {
    this.id = id;
    this.getId.mockReturnValue(id);
  }
}
