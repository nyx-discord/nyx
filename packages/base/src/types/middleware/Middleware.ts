import type { PriorityAware } from '#types/priority/PriorityAware';
import type { Protectable } from '../protect/Protectable';
import type { Awaitable } from '../types/Awaitable.js';
import type { MiddlewareResponse } from './response/MiddlewareResponse.js';

/** An object that intercepts and validates/decorates the execution of something. */
export interface Middleware<Checked, Args extends readonly unknown[]>
  extends Protectable, PriorityAware {
  /** Checks whether the checked object's execution should pass, given the execution arguments. */
  check(checked: Checked, ...args: Args): Awaitable<MiddlewareResponse>;
}
