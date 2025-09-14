import type { InjectableBotDependencies } from './inject/InjectableBotDependencies.js';

/** Type of options to create a bot. */
export interface BotOptions<Implementations extends InjectableBotDependencies> {
  token: string;
  client: Implementations['client'];
  deployCommands: boolean;

  logger: Implementations['logger'];
  commandManager: Implementations['commandManager'];
  eventManager: Implementations['eventManager'];
  scheduleManager: Implementations['scheduleManager'];
  sessionManager: Implementations['sessionManager'];
  pluginManager: Implementations['pluginManager'];
  service: Implementations['service'];
}
