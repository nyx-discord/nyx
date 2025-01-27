import type { Awaitable } from 'discord.js';

/** An object that can allow or deny the execution of an object. */
export interface Filter<Filtered, Args extends readonly unknown[]> {
  /** Returns whether to allow the object's execution, given the execution arguments. */
  check(filtered: Filtered, ...args: Args): Awaitable<boolean>;
}
