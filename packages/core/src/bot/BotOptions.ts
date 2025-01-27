import type { Client } from 'discord.js';

import type { CommandManager } from '../features/command/CommandManager.js';
import type { EventManager } from '../features/event/EventManager.js';
import type { PluginManager } from '../features/plugin/PluginManager.js';
import type { ScheduleManager } from '../features/schedule/ScheduleManager.js';
import type { SessionManager } from '../features/session/SessionManager.js';
import type { Identifier } from '../identity/Identifier.js';
import type { NyxLogger } from '../log/NyxLogger';
import type { BotService } from '../service/BotService.js';

/** Type of options to create a bot. */
export interface BotOptions<
  ConcreteLogger extends NyxLogger = NyxLogger,
  ConcreteCommandManager extends CommandManager = CommandManager,
  ConcreteEventManager extends EventManager = EventManager,
  ConcreteScheduleManager extends ScheduleManager = ScheduleManager,
  ConcreteSessionManager extends SessionManager = SessionManager,
  ConcretePluginManager extends PluginManager = PluginManager,
  ConcreteBotService extends BotService = BotService,
  ConcreteClient extends Client = Client,
> {
  token: string;
  client: ConcreteClient;
  id: Identifier;
  deployCommands: boolean;

  logger: ConcreteLogger;
  commands: ConcreteCommandManager;
  events: ConcreteEventManager;
  schedules: ConcreteScheduleManager;
  sessions: ConcreteSessionManager;
  plugins: ConcretePluginManager;
  service: ConcreteBotService;
}
