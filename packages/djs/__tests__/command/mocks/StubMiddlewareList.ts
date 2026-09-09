import type {
  CommandMiddlewareResolvable,
  MiddlewareList,
} from '@nyx-discord/types';
import { vi } from 'vitest';
import type { DjsInteractionTypes } from '../../../src/types/DjsInteractionTypes.js';

export class StubMiddlewareList {
  public static create(): MiddlewareList<
    CommandMiddlewareResolvable<DjsInteractionTypes>
  > {
    return {
      check: vi.fn().mockResolvedValue(true),
      add: vi.fn(),
      clear: vi.fn(),
      getMiddlewares: vi.fn().mockReturnValue([]),
      remove: vi.fn().mockReturnValue(false),
    } as unknown as MiddlewareList<
      CommandMiddlewareResolvable<DjsInteractionTypes>
    >;
  }
}
