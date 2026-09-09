import { Bot } from '@nyx-discord/djs';
import type { NyxBot } from '@nyx-discord/types';
import { Client } from 'discord.js';

export class MockBot extends Bot {
  public static createMock(): NyxBot {
    return super.create(() => ({
      client: new Client({ intents: 0 }),
      token: 'token',
      logger: console,
      deployCommands: false,
    })) as unknown as NyxBot;
  }
}
