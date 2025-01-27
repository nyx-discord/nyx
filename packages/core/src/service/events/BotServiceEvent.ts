/** Enum of possible bot service events. */
export const BotServiceEventEnum = {
  FirstStart: 'firstStart',
  Setup: 'setup',
  Start: 'start',
  Stop: 'stop',
  Kill: 'kill',
} as const satisfies Record<string, keyof BotServiceEventArgs>;

/** Type of values of {@link BotServiceEventEnum}. */
export type BotServiceEvent =
  (typeof BotServiceEventEnum)[keyof typeof BotServiceEventEnum];

/** Record of arguments for each bot service event. */
export interface BotServiceEventArgs {
  firstStart: [];
  setup: [];
  start: [];
  stop: [reason?: string];
  kill: [reason?: string];
}
