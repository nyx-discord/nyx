import { Bot, DjsNyxClient } from '@nyx-discord/djs';
import type { NyxBot } from '@nyx-discord/types';
import { Client } from 'discord.js';

export class MockBot extends Bot {
  public static createMock(): NyxBot {
    return super.create(() => ({
      client: new DjsNyxClient(new Client({ intents: 0 }), 'token'),
      token: 'token',
      logger: console,
      deployCommands: false,
    }));
  }
}
