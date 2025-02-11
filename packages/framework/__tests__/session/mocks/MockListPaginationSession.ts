import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { AbstractListPaginationSession } from '../../../src';
import { MockBot } from '../../bot/MockBot';

export class MockListPaginationSession<T> extends AbstractListPaginationSession<
  T,
  void
> {
  public static createMock<T>(items: T[]) {
    return new this<T>({
      bot: MockBot.createMock(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
      items,
    });
  }

  public onStart = jest.fn();

  public onEnd = jest.fn();

  public updatePage = jest.fn();
}
