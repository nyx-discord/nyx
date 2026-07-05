import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { MockBot } from '../../../../framework/__tests__/bot/MockBot';
import { AbstractStagePaginationSession } from '../../../../framework/src';
import { MockSessionStage } from './MockSessionStage';
import { MockSessionStartStage } from './MockSessionStartStage';

export class MockStagePaginationSession extends AbstractStagePaginationSession<void> {
  public onEnd = vi.fn();
  protected readonly stages = [
    new MockSessionStartStage(this),
    new MockSessionStage(this),
  ] as const;

  public static createMock() {
    return new this({
      bot: MockBot.createMock(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
    });
  }
}
