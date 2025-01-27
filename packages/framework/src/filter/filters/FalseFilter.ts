import { AbstractFilter } from '../AbstractFilter.js';

/** A filter that always denies. */
export class FalseFilter extends AbstractFilter<any, []> {
  public static readonly Instance = new FalseFilter();

  public check(): false {
    return false;
  }
}
