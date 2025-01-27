/**
 * The status of a {@link NyxBot}.
 *
 * *  `Unprepared` - The bot hasn't been set up and is on an unsafe state.
 * *  `Waiting` - The bot has been set up and is waiting to be started.
 * *  `Running` - The bot is running.
 * *  `Stopped` - The bot has been stopped.
 * *  `Killed` - The bot has been killed by an error during its start.
 */
export const BotStatusEnum = {
  Unprepared: 'unprepared',
  Waiting: 'waiting',
  Running: 'running',
  Stopped: 'stopped',
  Killed: 'killed',
} as const;

/** Type of values of {@link BotStatusEnum}. */
export type BotStatus = (typeof BotStatusEnum)[keyof typeof BotStatusEnum];
