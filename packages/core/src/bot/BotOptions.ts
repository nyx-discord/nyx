import type { InjectableBotDependencies } from './inject/InjectableBotDependencies.js';

/** Type of options to create a bot. */
export interface BotOptions<Implementations extends InjectableBotDependencies> {
  token: string;
  client: Implementations['client'];
  deployCommands: boolean;

  logger: Implementations['logger'];
  commandManager: Implementations['commandManager'];
  clientEventBus: Implementations['clientEventBus'];
  scheduleManager: Implementations['scheduleManager'];
  pluginManager: Implementations['pluginManager'];
  service: Implementations['service'];
}
