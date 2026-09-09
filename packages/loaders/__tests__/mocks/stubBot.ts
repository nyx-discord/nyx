import type { NyxBot } from '@nyx-discord/types';

export class StubBot {
  public static create(): NyxBot {
    const logger = {
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    };
    const commandManager = {
      addCommands: async () => {},
      subscribe: async () => {},
    };
    const scheduleManager = {
      addSchedule: async () => {},
      subscribe: async () => {},
    };
    const service = {
      subscribe: async () => {},
    };
    const pluginManager = {
      subscribe: async () => {},
    };

    return {
      getLogger: () => logger,
      getCommandManager: () => commandManager,
      getScheduleManager: () => scheduleManager,
      getService: () => service,
      getPluginManager: () => pluginManager,
      subscribeToClient: async () => {},
    } as unknown as NyxBot;
  }
}
