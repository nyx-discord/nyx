import type { Filter, FilterResolvable } from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';
import { AbstractFilter } from '../AbstractFilter.js';

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
