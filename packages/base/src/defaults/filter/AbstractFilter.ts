import type { Filter } from '#types/filter/Filter';
import type { Awaitable } from '#types/types/Awaitable';

export abstract class AbstractFilter<
  Filtered,
  Args extends readonly unknown[],
> implements Filter<Filtered, Args> {
  public abstract check(filtered: Filtered, ...args: Args): Awaitable<boolean>;
}
