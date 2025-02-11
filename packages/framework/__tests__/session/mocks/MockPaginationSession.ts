import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { AbstractPaginationSession } from '../../../src';
import { MockBot } from '../../bot/MockBot';

export class MockPaginationSession extends AbstractPaginationSession<void> {
  public static createMock() {
    return new this({
      bot: MockBot.createMock(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
    });
  }

  public onStart = jest.fn();

  public onEnd = jest.fn();

  public updatePage = jest.fn();
}
