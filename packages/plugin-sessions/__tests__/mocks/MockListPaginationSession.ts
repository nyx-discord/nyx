import type { SessionStartInteraction } from '#src';
import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { getTestBot } from '../testBot';
import { AbstractListPaginationSession } from '#src';

export class MockListPaginationSession<T> extends AbstractListPaginationSession<
  T,
  void
> {
  public onStart = vi.fn();
  public onEnd = vi.fn();
  public updatePage = vi.fn();

  public static async createMock<T>(items: T[]) {
    return new this<T>({
      bot: await getTestBot(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction<DjsInteractionTypes>,
      items,
    });
  }
}
