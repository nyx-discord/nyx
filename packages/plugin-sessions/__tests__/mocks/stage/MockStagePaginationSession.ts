import type { NyxBot } from '@nyx-discord/types';
import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { SessionStartInteraction } from '#src';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { getTestBot } from '../../testBot';
import { AbstractStagePaginationSession } from '#src';
import { MockSessionStage } from './MockSessionStage';
import { MockSessionStartStage } from './MockSessionStartStage';

export class MockStagePaginationSession extends AbstractStagePaginationSession<void> {
  public onEnd = vi.fn();
  protected readonly stages = [
    new MockSessionStartStage(this),
    new MockSessionStage(this),
  ] as const;

  public static async createMock(existingBot?: NyxBot) {
    return new this({
      bot: existingBot ?? await getTestBot(),
      id: randomUUID(),
      startInteraction: {} as SessionStartInteraction<DjsInteractionTypes>,
    });
  }
}
