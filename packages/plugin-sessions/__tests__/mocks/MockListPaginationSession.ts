import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { MockBot } from '../../../framework/__tests__/bot/MockBot';
import { AbstractListPaginationSession } from '../../../framework/src';

export class MockListPaginationSession<T> extends AbstractListPaginationSession<
  T,
  void
> {
  public onStart = vi.fn();
  public onEnd = vi.fn();
  public updatePage = vi.fn();

  public static createMock<T>(items: T[]) {
    return new this<T>({
      bot: MockBot.createMock(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction,
      items,
    });
  }
}
