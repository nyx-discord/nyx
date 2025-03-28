import { Client } from 'discord.js';
import { CommandManager } from '../../features/command/CommandManager';
import { EventManager } from '../../features/event/EventManager';
import { PluginManager } from '../../features/plugin/PluginManager';
import { ScheduleManager } from '../../features/schedule/ScheduleManager';
import { SessionManager } from '../../features/session/SessionManager';
import { NyxLogger } from '../../log/NyxLogger';
import { BotService } from '../../service/BotService';

export type InjectableBotDependencies = {
  logger: NyxLogger;
  client: Client;
  commandManager: CommandManager;
  eventManager: EventManager;
  scheduleManager: ScheduleManager;
  sessionManager: SessionManager;
  pluginManager: PluginManager;
  service: BotService;
};
