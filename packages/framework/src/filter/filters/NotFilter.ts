import type { Filter } from '@nyx-discord/core';

import { AbstractFilter } from '../AbstractFilter.js';

/** A filter that returns the opposite result that the provided filter returns (NOT gate). */
export class NotFilter extends AbstractFilter<unknown, unknown[]> {
  protected readonly filter: Filter<unknown, unknown[]>;

  /** We actually need to override the constructor to only accept one filter, not many. */
  constructor(filter: Filter<unknown, unknown[]>) {
    super();

    this.filter = filter;
  }

  public async check(filtered: unknown, ...args: unknown[]): Promise<boolean> {
    const success = await this.filter.check(filtered, ...args);

    return !success;
  }
}
