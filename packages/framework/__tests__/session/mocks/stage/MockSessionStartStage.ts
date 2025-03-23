import { vi } from 'vitest';
import { AbstractSessionStartStage } from '../../../../src';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStartStage extends AbstractSessionStartStage {
  public static createMock() {
    return new this(MockStagePaginationSession.createMock());
  }

  public onSwitch = vi.fn();

  public onLeave = vi.fn();

  public onStart = vi.fn();
}
