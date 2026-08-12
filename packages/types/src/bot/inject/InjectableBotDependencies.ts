import type { NyxClient } from '../../client/NyxClient';
import type { CommandManager } from '../../features/command/CommandManager';
import type { InteractionTypes } from '../../features/command/InteractionTypes';
import type { EventBus } from '../../features/event/bus/EventBus';
import type { PluginManager } from '../../features/plugin/PluginManager';
import type { ScheduleManager } from '../../features/schedule/ScheduleManager';
import type { NyxLogger } from '../../log/NyxLogger';
import type { BotService } from '../../service/BotService';

export type InjectableBotDependencies<
  Types extends InteractionTypes = InteractionTypes,
  Client extends NyxClient = NyxClient,
  ClientEventMap extends Record<string, unknown[]> = Record<string, unknown[]>,
> = {
  logger: NyxLogger;
  client: Client;
  commandManager: CommandManager<Types, ClientEventMap>;
  clientEventBus: EventBus<ClientEventMap>;
  scheduleManager: ScheduleManager;
  pluginManager: PluginManager;
  service: BotService;
};
