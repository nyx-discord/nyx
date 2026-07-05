import { vi } from 'vitest';
import { AbstractSessionStartStage } from '../../../../framework/src';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStartStage extends AbstractSessionStartStage {
  public onSwitch = vi.fn();
  public onLeave = vi.fn();
  public onStart = vi.fn();

  public static createMock() {
    return new this(MockStagePaginationSession.createMock());
  }
}
