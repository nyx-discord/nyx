import type { Awaitable } from 'discord.js';
import type { NyxBot } from '../bot/NyxBot.js';
import type { Identifier } from '../identity/Identifier';
import type { BotStatus } from './BotStatus';

/** The object responsible for managing a bot's . */
export interface BotService {
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
  stop(reason?: Identifier): Awaitable<this>;

  /** Returns a promise that will resolver once a start is successful. */
  getStartPromise(): Promise<NyxBot>;

  /**
   * Returns whether the bot is running.
   *
   * Alias for `BotService#getStatus() === BotStatusEnum.Running`.
   */
  isRunning(): boolean;

  /**
   * Returns the status of the bot.
   *
   * @see {@link BotStatusEnum}
   */
  getStatus(): BotStatus;
}
