import { Identifier } from '../../identity/Identifier';

/** Enum of possible bot service events. */
export const BotServiceEventEnum = {
  Start: 'start',
  Stop: 'stop',
} as const satisfies Record<string, keyof BotServiceEventArgs>;

/** Type of values of {@link BotServiceEventEnum}. */
export type BotServiceEvent =
  (typeof BotServiceEventEnum)[keyof typeof BotServiceEventEnum];

/** Record of arguments for each bot service event. */
export interface BotServiceEventArgs {
  start: [];
  stop: [reason?: Identifier];
}
