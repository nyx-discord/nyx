import type { Filter } from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';

export abstract class AbstractFilter<
  Filtered,
  Args extends readonly unknown[],
> implements Filter<Filtered, Args> {
  public abstract check(filtered: Filtered, ...args: Args): Awaitable<boolean>;
}
