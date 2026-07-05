import type { SessionStartInteraction } from '#src';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { getTestBot } from '../testBot';
import { AbstractSession } from '#src';

export class MockSession extends AbstractSession {
  public onStart = vi.fn();
  public onEnd = vi.fn();

  public static async createMock() {
    return new this({
      bot: await getTestBot(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
    });
  }
}
