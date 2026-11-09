import { vi } from 'vitest';
import { getTestBot } from '../../testBot';
import { AbstractSessionStartStage } from '#src';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStartStage extends AbstractSessionStartStage {
  public onSwitch = vi.fn();
  public onLeave = vi.fn();
  public onStart = vi.fn();

  public static async createMock() {
    const bot = await getTestBot();
    return new this(await MockStagePaginationSession.createMock(bot));
  }
}
