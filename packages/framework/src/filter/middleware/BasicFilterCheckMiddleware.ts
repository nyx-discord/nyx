import type {
  Filterable,
  FilterResolvable,
  MiddlewareResponse,
} from '@nyx-discord/core';
import { AbstractMiddleware } from '../../middleware/AbstractMiddleware.js';

type ExtractFilterArgs<
  Of extends Filterable<FilterResolvable<unknown, unknown[]>>,
> =
  Of extends Filterable<FilterResolvable<unknown, infer Args extends unknown[]>>
    ? Args
    : never;

export class BasicFilterCheckMiddleware<
  Checked extends Filterable<FilterResolvable<unknown, unknown[]>>,
> extends AbstractMiddleware<Checked, ExtractFilterArgs<Checked>> {
  protected override locked = true;

  public async check(
    checked: Checked,
    ...args: ExtractFilterArgs<Checked>
  ): Promise<MiddlewareResponse> {
    const filter = checked.getFilter();
    if (!filter) return this.true();

    const result =
      typeof filter === 'object'
        ? await filter.check(checked, ...args)
        : await filter.bind(checked)(checked, ...args);

    return result ? this.true() : this.false();
  }
}
