import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { AbstractSession } from '../../../src';
import { MockBot } from '../../bot/MockBot';

export class MockSession extends AbstractSession {
  public static createMock() {
    return new this({
      bot: MockBot.createMock(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
    });
  }

  public onStart = vi.fn();

  public onEnd = vi.fn();
}
