import type { Identifiable } from '../identity/Identifiable.js';
import { Identifier } from '../identity/Identifier';
import { BotStatus } from '../service/BotStatus';
import { InjectableBotDependencies } from './inject/InjectableBotDependencies.js';

/** A bot of the nyx framework. */
export interface NyxBot<
  Implementations extends InjectableBotDependencies = InjectableBotDependencies,
> extends Identifiable {
  /** Returns the logger of this bot for console output. */
  getLogger(): Implementations['logger'];

  /** Returns the Discord.js {@link Client} of this bot. */
  getClient(): Implementations['client'];

  /** Returns the {@link CommandManager} of this bot for {@link Command} managing. */
  getCommandManager(): Implementations['commandManager'];

  /** Returns the {@link EventManager} of this bot for event managing. */
  getEventManager(): Implementations['eventManager'];

  /** Returns the {@link ScheduleManager} of this bot for {@link Schedule} managing. */
  getScheduleManager(): Implementations['scheduleManager'];

  /** Returns the {@link SessionManager} of this bot for {@link Session} managing. */
  getSessionManager(): Implementations['sessionManager'];

  /** Returns the {@link PluginManager} of this bot for {@link NyxPlugin} managing. */
  getPluginManager(): Implementations['pluginManager'];

  /** Returns the {@link BotService} of this bot for managing bot status. */
  getService(): Implementations['service'];

  /** Starts the bot. Alias for {@link BotService#start}. */
  start(): Promise<this>;

  /** Stops the bot. Alias for {@link BotService#stop}. Once it's stopped, it cannot be started again. */
  stop(reason?: Identifier): Promise<this>;

  /** Returns the bot's status. */
  getStatus(): BotStatus;

  /** Returns this bot's token. */
  getToken(): string;

  /** Decorates the bot object with a value given a key. */
  decorate<Key extends string | symbol, Value>(
    key: Key,
    value: Value,
  ): asserts this is this & Record<Key, Value>;
}
