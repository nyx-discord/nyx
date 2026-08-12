/**
 * The status of a {@link NyxBot}.
 *
 * *  `Waiting` - Post creation, before running {@link NyxBot#start()}.
 * *  `Running` - The bot is running.
 * *  `Stopped` - The bot has been stopped.
 * *  `Killed` - The bot has been killed by an error during its start.
 */
export const BotStatusEnum = {
  Waiting: 'waiting',
  Running: 'running',
  Stopped: 'stopped',
  Killed: 'killed',
} as const;

/** Type of values of {@link BotStatusEnum}. */
export type BotStatus = (typeof BotStatusEnum)[keyof typeof BotStatusEnum];
