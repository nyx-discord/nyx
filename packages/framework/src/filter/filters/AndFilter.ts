import { AbstractFilterAggregator } from './AbstractFilterAggregator.js';

/** A filter aggregator that returns whether all the provided filters pass (AND gate). */
export class AndFilter extends AbstractFilterAggregator<unknown, unknown[]> {
  public async check(filtered: unknown, ...args: unknown[]): Promise<boolean> {
    for (const filter of this.filters) {
      const success = await filter.check(filtered, ...args);
      if (!success) return false;
    }
    return true;
  }
}
