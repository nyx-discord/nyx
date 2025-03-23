import { vi } from 'vitest';
import { AbstractSessionStage } from '../../../../src';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStage extends AbstractSessionStage {
  public static createMock() {
    return new this(MockStagePaginationSession.createMock());
  }

  public onSwitch = vi.fn();

  public onLeave = vi.fn();
}
