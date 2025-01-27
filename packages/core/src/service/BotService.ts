import type { Awaitable } from 'discord.js';
import type { BotAware } from '../bot/BotAware.js';
import type { NyxBot } from '../bot/NyxBot.js';
import type { EventBus } from '../features/event/bus/EventBus.js';
import type { EventSubscriber } from '../features/event/subscriber/EventSubscriber';
import type { BotStatus } from './BotStatus.js';
import type { BotServiceEventArgs } from './events/BotServiceEvent.js';

/** The object responsible for managing and informing about the status of a {@link BotStatus}. */
export interface BotService extends BotAware {
  /**
   * Setups every component in the bot.
   *
   * @throws {IllegalStateError} If the bot is already running, has already
   *   been setup or it has been stopped.
   * @throws {Error} If any error is thrown while starting the managers or
   *   logging in.
   */
  setup(): Awaitable<this>;

  /**
   * Starts the bot, that is setting it up and logging.
   *
   * @throws {IllegalStateError} If the bot is already running, or it has been
   *   stopped.
   * @throws {Error} If any error is thrown while starting the managers or
   *   logging in.
   */
  start(): Awaitable<this>;

  /**
   * Stops the bot.
   *
   * @throws {IllegalStateError} If the bot is not running.
   * @throws {Error} If any error is thrown while stopping the managers.
   */
  stop(reason?: string): Awaitable<this>;

  /** Returns a promise that will resolver once a start is successful. */
  getStartPromise(): Promise<NyxBot>;

  /**
   * Returns whether the bot is running.
   *
   * Alias for `bot.getStatus() === BotStatusEnum.Running`.
   */
  isRunning(): boolean;

  /**
   * Subscribes a list of event subscribers to the service's bus.
   *
   * Alias of:
   * ```
   * const managerBus = botService.getEventBus();
   * await managerBus.subscribe(subscriber);
   * ```
   */
  subscribe(
    ...subscribers: EventSubscriber<
      BotServiceEventArgs,
      keyof BotServiceEventArgs
    >[]
  ): Awaitable<this>;

  /** Returns the {@link EventBus} for the bot's service events. */
  getEventBus(): EventBus<BotServiceEventArgs>;

  /** Returns the current status of the bot. */
  getStatus(): BotStatus;
}
