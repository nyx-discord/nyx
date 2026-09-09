import type { EventSubscriberFilter } from '@nyx-discord/types';
import { vi } from 'vitest';

export class StubEventSubscriberFilter {
  public static create(passes = true): EventSubscriberFilter<any, any> {
    return {
      check: vi.fn().mockResolvedValue(passes),
    } as unknown as EventSubscriberFilter<any, any>;
  }
}
