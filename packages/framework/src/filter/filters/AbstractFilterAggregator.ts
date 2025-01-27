import type { Filter } from '@nyx-discord/core';

import { AbstractFilter } from '../AbstractFilter.js';

/** A filter that merges filters together. */
export abstract class AbstractFilterAggregator<
  Filtered,
  Args extends readonly unknown[],
> extends AbstractFilter<Filtered, Args> {
  protected readonly filters: Filter<unknown, Args>[] = [];

  constructor(
    firstFilter: Filter<Filtered, Args>,
    ...filters: Filter<Filtered, Args>[]
  ) {
    super();

    this.filters = [firstFilter, ...filters];
  }

  public push(...filters: Filter<Filtered, Args>[]): this {
    this.filters.push(...filters);

    return this;
  }
}
