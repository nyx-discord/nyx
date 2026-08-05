import type { NyxBot } from '@nyx-discord/framework';

export function createStubBot(): NyxBot {
  return {
    getLogger: () => ({
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    }),
  } as unknown as NyxBot;
}
