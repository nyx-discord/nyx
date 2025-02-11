import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
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

  public onStart = jest.fn();

  public onEnd = jest.fn();
}
