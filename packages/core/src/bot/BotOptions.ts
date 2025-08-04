import { InjectableBotDependencies } from './inject/InjectableBotDependencies.js';

/** Type of options to create a bot. */
export interface BotOptions<Implementations extends InjectableBotDependencies> {
  token: string;
  client: Implementations['client'];
  deployCommands: boolean;

  logger: Implementations['logger'];
  commands: Implementations['commandManager'];
  events: Implementations['eventManager'];
  schedules: Implementations['scheduleManager'];
  sessions: Implementations['sessionManager'];
  plugins: Implementations['pluginManager'];
  service: Implementations['service'];
}
