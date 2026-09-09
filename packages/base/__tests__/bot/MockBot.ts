import type { NyxBot } from '@nyx-discord/types';
import { BaseBot } from '../../src';

export class MockBot extends BaseBot {
  public static createMock(): NyxBot {
    return new MockBot(() => ({
      client: {},
      token: 'token',
      logger: console,
      commandManager: {
        getCustomIdCodec: () => ({
          serialize: (data: any) => JSON.stringify(data),
          deserialize: (data: string) => JSON.parse(data),
        })
      },
      deployCommands: false,
    } as any));
  }
}
