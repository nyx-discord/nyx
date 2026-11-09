import type { SessionStartInteraction } from '#src';
import type { DjsInteractionTypes } from '@nyx-discord/djs';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { getTestBot } from '../testBot';
import { AbstractPaginationSession } from '#src';

export class MockPaginationSession extends AbstractPaginationSession<void> {
  public onStart = vi.fn();
  public onEnd = vi.fn();
  public updatePage = vi.fn();

  public static async createMock() {
    return new this({
      bot: await getTestBot(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction<DjsInteractionTypes>,
    });
  }
}
