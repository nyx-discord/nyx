import { AbstractFilter } from '../AbstractFilter';

/** A special kind of filter that always returns `true`. */
export class TrueFilter extends AbstractFilter<unknown, unknown[]> {
  public static readonly Instance = new TrueFilter();

  public check(): true {
    return true;
  }
}
