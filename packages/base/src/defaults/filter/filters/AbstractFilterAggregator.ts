import type { Filter } from '#types/filter/Filter';
import type { FilterResolvable } from '#types/filter/FilterResolvable';
import type { Awaitable } from '#types/types/Awaitable';
import { AbstractFilter } from '../AbstractFilter';

/** A filter that merges filters together. */
export abstract class AbstractFilterAggregator<
  Filtered,
  Args extends readonly unknown[],
> extends AbstractFilter<Filtered, Args> {
  protected readonly filters: FilterResolvable<unknown, Args>[] = [];

  constructor(
    firstFilter: FilterResolvable<Filtered, Args>,
    ...filters: FilterResolvable<Filtered, Args>[]
  ) {
    super();

    this.filters = [firstFilter, ...filters];
  }

  public push(...filters: Filter<Filtered, Args>[]): this {
    this.filters.push(...filters);

    return this;
  }

  protected checkFilter(
    filter: FilterResolvable<unknown, Args>,
    filtered: Filtered,
    ...args: Args
  ): Awaitable<boolean> {
    return typeof filter === 'object'
      ? filter.check(filtered, ...args)
      : filter.bind(filtered)(filtered, ...args);
  }
}
