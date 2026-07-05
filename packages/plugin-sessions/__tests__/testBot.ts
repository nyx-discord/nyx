import type { NyxBot } from '@nyx-discord/framework';
import { MockBot } from '../../framework/__tests__/bot/MockBot';
import { SessionPlugin } from '#src';

let botPromise: Promise<NyxBot> | null = null;

export async function getTestBot(): Promise<NyxBot> {
  if (!botPromise) {
    botPromise = (async () => {
      const bot = MockBot.createMock();
      await bot.getPluginManager().register(SessionPlugin.create());
      return bot;
    })();
  }
  return botPromise;
}
