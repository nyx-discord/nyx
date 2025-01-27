import type { NyxBot } from './NyxBot.js';

/** An object that belongs to a {@link NyxBot}. */
export interface BotAware {
  /** The {@link NyxBot} of this object. */
  readonly bot: NyxBot;
}
