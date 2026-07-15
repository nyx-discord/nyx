import type { SessionStartInteraction } from '#src';
import type { NyxBot } from '@nyx-discord/framework';
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
      startInteraction: {} as SessionStartInteraction,
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
        user: { id: overrides?.userId ?? 'user-1' },
        guildId: overrides?.guildId ?? 'guild-1',
        channelId: overrides?.channelId ?? 'channel-1',
        replied: false,
      } as unknown as SessionStartInteraction,
    });
  }
}
