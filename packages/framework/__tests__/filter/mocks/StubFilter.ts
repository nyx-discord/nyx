import type { Filter } from '@nyx-discord/core';
import { vi } from 'vitest';

export class StubFilter {
  public static create(passes = true): Filter<unknown, unknown[]> {
    return {
      check: vi.fn().mockResolvedValue(passes),
    } as unknown as Filter<unknown, unknown[]>;
  }
}
