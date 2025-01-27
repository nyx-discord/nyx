import type { Filter, Filterable, MiddlewareResponse } from '@nyx-discord/core';
import { AbstractMiddleware } from '../../middleware/AbstractMiddleware.js';

type ExtractFilterArgs<Of extends Filterable<Filter<unknown, unknown[]>>> =
  Of extends Filterable<Filter<unknown, infer Args extends unknown[]>>
    ? Args
    : never;

export class BasicFilterCheckMiddleware<
  Checked extends Filterable<Filter<unknown, unknown[]>>,
> extends AbstractMiddleware<Checked, ExtractFilterArgs<Checked>> {
  protected override locked = true;

  public async check(
    checked: Checked,
    ...args: ExtractFilterArgs<Checked>
  ): Promise<MiddlewareResponse> {
    const filter = checked.getFilter();
    if (!filter) return this.true();

    const result = await filter.check(checked, ...args);
    if (!result) return this.false();

    return this.true();
  }
}
