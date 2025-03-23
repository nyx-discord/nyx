import type { SessionStartInteraction } from '@nyx-discord/core';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
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

  public onStart = vi.fn();

  public onEnd = vi.fn();

  public updatePage = vi.fn();
}
