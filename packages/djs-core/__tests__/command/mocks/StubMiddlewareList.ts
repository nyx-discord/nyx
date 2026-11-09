import type {
  CommandMiddlewareResolvable,
  MiddlewareList,
} from '@nyx-discord/base';
import { vi } from 'vitest';
import type { CoreInteractionTypes } from '../../../src';

export class StubMiddlewareList {
  public static create(): MiddlewareList<
    CommandMiddlewareResolvable<CoreInteractionTypes>
  > {
    return {
      check: vi.fn().mockResolvedValue(true),
      add: vi.fn(),
      clear: vi.fn(),
      getMiddlewares: vi.fn().mockReturnValue([]),
      remove: vi.fn().mockReturnValue(false),
    } as unknown as MiddlewareList<
      CommandMiddlewareResolvable<CoreInteractionTypes>
    >;
  }
}
