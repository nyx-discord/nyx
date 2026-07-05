import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { MockBot } from '../../../framework/__tests__/bot/MockBot';
import { AbstractPaginationSession } from '../../../framework/src';

export class MockPaginationSession extends AbstractPaginationSession<void> {
  public onStart = vi.fn();
  public onEnd = vi.fn();
  public updatePage = vi.fn();

  public static createMock() {
    return new this({
      bot: MockBot.createMock(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
    });
  }
}
