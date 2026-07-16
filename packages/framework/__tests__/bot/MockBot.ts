import type { NyxBot } from '@nyx-discord/core';
import { Client } from 'discord.js';
import { Bot } from '../../src';

export class MockBot extends Bot {
  public static createMock(): NyxBot {
    return super.create(() => ({
      client: new Client({ intents: 0 }),
      token: 'token',
      id: 'id',
      logger: console,
      deployCommands: false,
    }));
  }
}
