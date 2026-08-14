import type { NyxBot } from '@nyx-discord/types';

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
