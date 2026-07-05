import type { Client } from 'discord.js';
import type { CommandManager } from '../../features/command/CommandManager';
import type { EventManager } from '../../features/event/EventManager';
import type { PluginManager } from '../../features/plugin/PluginManager';
import type { ScheduleManager } from '../../features/schedule/ScheduleManager';
import type { NyxLogger } from '../../log/NyxLogger';
import type { BotService } from '../../service/BotService';

export type InjectableBotDependencies = {
  logger: NyxLogger;
  client: Client;
  commandManager: CommandManager;
  eventManager: EventManager;
  scheduleManager: ScheduleManager;
  pluginManager: PluginManager;
  service: BotService;
};
