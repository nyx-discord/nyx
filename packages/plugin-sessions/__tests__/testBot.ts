import type { NyxBot } from '@nyx-discord/types';
import { DjsSessionPlugin } from '#src';
import { MockBot } from './MockBot';

let botPromise: Promise<NyxBot> | null = null;

export async function getTestBot(): Promise<NyxBot> {
  if (!botPromise) {
    botPromise = (async () => {
      const bot = MockBot.createMock();
      await bot.getPluginManager().register(DjsSessionPlugin.create());
      return bot;
    })();
  }
  return botPromise;
}
