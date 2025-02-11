import type {
  BotService,
  CommandManager,
  EventManager,
  NyxBot,
  NyxLogger,
  PluginManager,
  ScheduleManager,
  SessionManager,
} from '@nyx-discord/core';
import { Client } from 'discord.js';
import { Bot } from '../../src';

export class MockBot extends Bot<
  NyxLogger,
  CommandManager,
  EventManager,
  ScheduleManager,
  SessionManager,
  PluginManager,
  BotService,
  Client
> {
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
