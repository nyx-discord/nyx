import { AbstractSessionStartStage } from '../../../../src';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStartStage extends AbstractSessionStartStage {
  public static createMock() {
    return new this(MockStagePaginationSession.createMock());
  }

  public onSwitch = jest.fn();

  public onLeave = jest.fn();

  public onStart = jest.fn();
}
