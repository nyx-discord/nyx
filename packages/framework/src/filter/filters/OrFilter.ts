import { AbstractFilterAggregator } from './AbstractFilterAggregator.js';

/** A filter aggregator that passes if at least one of the provided filters passes (OR gate). */
export class OrFilter extends AbstractFilterAggregator<unknown, unknown[]> {
  public async check(filtered: unknown, ...args: unknown[]): Promise<boolean> {
    for (const filter of this.filters) {
      const success = await filter.check(filtered, ...args);
      if (success) return success;
    }
    return false;
  }
}
