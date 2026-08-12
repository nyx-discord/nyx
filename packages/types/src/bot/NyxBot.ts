import type { EventBus } from '../features/event/bus/EventBus';
import type { EventSubscriber } from '../features/event/subscriber/EventSubscriber';
import type { Identifier } from '../identity/Identifier';
import type { BotStatus } from '../service/BotStatus';
import type { InjectableBotDependencies } from './inject/InjectableBotDependencies.js';

type ClientEventMapOf<Implementations extends InjectableBotDependencies> =
  Implementations['clientEventBus'] extends EventBus<
    infer ArgsRecord extends Record<string, unknown[]>
  >
    ? ArgsRecord
    : never;

/** A bot of the nyx framework. */
export interface NyxBot<
  Implementations extends InjectableBotDependencies = InjectableBotDependencies,
> {
  /** Returns the logger of this bot for console output. */
  getLogger(): Implementations['logger'];

  /** Returns the client of this bot. */
  getClient(): Implementations['client'];

  /** Returns the {@link CommandManager} of this bot for {@link Command} managing. */
  getCommandManager(): Implementations['commandManager'];

  /** Returns the {@link EventBus} to subscribe to client events. */
  getClientEventBus(): Implementations['clientEventBus'];

  /** Returns the {@link ScheduleManager} of this bot for {@link Schedule} managing. */
  getScheduleManager(): Implementations['scheduleManager'];

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

  /**
   * Subscribes a list of event subscribers to the {@link getClientEventBus Client EventBus}.
   *
   * Alias of:
   * ```
   * const clientBus = bot.getClientEventBus();
   * await clientBus.subscribe(subscriber);
   * ```
   */
  subscribeToClient(
    ...subscribers: EventSubscriber<
      ClientEventMapOf<Implementations>,
      keyof ClientEventMapOf<Implementations> & string
    >[]
  ): Promise<this>;
}
