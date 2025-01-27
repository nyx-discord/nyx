import type { Awaitable } from 'discord.js';

/** An object that observes the lifecycle of a bot. */
export interface BotLifecycleObserver {
  /** Called when the bot is setup. */
  onSetup(): Awaitable<void>;

  /** Called when the bot is started. */
  onStart(): Awaitable<void>;

  /** Called when the bot is stopped. */
  onStop(): Awaitable<void>;
}
