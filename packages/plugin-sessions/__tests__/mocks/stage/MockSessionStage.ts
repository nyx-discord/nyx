import { AbstractSessionStage } from '#src';
import { vi } from 'vitest';
import { getTestBot } from '../../testBot';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStage extends AbstractSessionStage {
  public onSwitch = vi.fn();
  public onLeave = vi.fn();

  public static async createMock() {
    const bot = await getTestBot();
    return new this(await MockStagePaginationSession.createMock(bot));
  }

  public getBot() {
    return this.session.getBot();
  }
}
