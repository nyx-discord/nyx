import { AbstractSessionStage } from '../../../../src';
import { MockStagePaginationSession } from './MockStagePaginationSession';

export class MockSessionStage extends AbstractSessionStage {
  public static createMock() {
    return new this(MockStagePaginationSession.createMock());
  }

  public onSwitch = jest.fn();

  public onLeave = jest.fn();
}
