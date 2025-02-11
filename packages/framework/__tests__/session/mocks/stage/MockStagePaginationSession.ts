import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { AbstractStagePaginationSession } from '../../../../src';
import { MockBot } from '../../../bot/MockBot';
import { MockSessionStage } from './MockSessionStage';
import { MockSessionStartStage } from './MockSessionStartStage';

export class MockStagePaginationSession extends AbstractStagePaginationSession<void> {
  public static createMock() {
    return new this({
      bot: MockBot.createMock(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
    });
  }

  protected readonly stages = [
    new MockSessionStartStage(this),
    new MockSessionStage(this),
  ] as const;

  public onEnd = jest.fn();
}
