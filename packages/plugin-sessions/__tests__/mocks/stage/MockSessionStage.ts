import { vi } from 'vitest';
import { AbstractSessionStage } from '../../../../framework/src';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStage extends AbstractSessionStage {
  public onSwitch = vi.fn();
  public onLeave = vi.fn();

  public static createMock() {
    return new this(MockStagePaginationSession.createMock());
  }
}
