import type { Filter } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

export abstract class AbstractFilter<Filtered, Args extends readonly unknown[]>
  implements Filter<Filtered, Args>
{
  public abstract check(filtered: Filtered, ...args: Args): Awaitable<boolean>;
}
