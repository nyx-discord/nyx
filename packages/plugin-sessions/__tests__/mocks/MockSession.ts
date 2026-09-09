import type { SessionStartInteraction } from '#src';
import type { DjsInteractionTypes } from '@nyx-discord/djs';
import type { NyxBot } from '@nyx-discord/types';
import { randomUUID } from 'crypto';
import { vi } from 'vitest';
import { getTestBot } from '../testBot';
import { AbstractSession } from '#src';

export class MockSession extends AbstractSession {
  public onStart = vi.fn();
  public onEnd = vi.fn();

  public static async createMock() {
    return new this({
      bot: await getTestBot(),
      id: randomUUID(),
      startInteraction: {
        user: { id: 'user-1' },
        guildId: 'guild-1',
        channelId: 'channel-1',
        replied: false,
      } as unknown as SessionStartInteraction<DjsInteractionTypes>,
    });
  }

  public static withInteraction(
    bot: NyxBot,
    overrides?: {
      userId?: string;
      guildId?: string | null;
      channelId?: string;
    },
  ): MockSession {
    return new this({
      bot,
      id: randomUUID(),
      startInteraction: {
        user: {
          id: overrides?.userId !== undefined ? overrides.userId : 'user-1',
        },
        guildId:
          overrides?.guildId !== undefined ? overrides.guildId : 'guild-1',
        channelId:
          overrides?.channelId !== undefined
            ? overrides.channelId
            : 'channel-1',
        replied: false,
      } as unknown as SessionStartInteraction<DjsInteractionTypes>,

    });
  }
}
