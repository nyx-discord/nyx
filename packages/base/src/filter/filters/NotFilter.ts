import type { FilterResolvable } from '@nyx-discord/types';
import { AbstractFilter } from '../AbstractFilter.js';

/** A filter that returns the opposite result that the provided filter returns (NOT gate). */
export class NotFilter extends AbstractFilter<unknown, unknown[]> {
  protected readonly filter: FilterResolvable<unknown, unknown[]>;

  /** We actually need to override the constructor to only accept one filter, not many. */
  constructor(filter: FilterResolvable<unknown, unknown[]>) {
    super();
    this.filter = filter;
  }

  public async check(filtered: unknown, ...args: unknown[]): Promise<boolean> {
    const success =
      typeof this.filter === 'object'
        ? await this.filter.check(filtered, ...args)
        : await this.filter.bind(filtered)(filtered, ...args);
    return !success;
  }
}
