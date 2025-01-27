import type { Awaitable } from 'discord.js';
import type { Lockable } from '../lock/Lockable.js';
import type { Priority } from '../priority/Priority.js';
import type { MiddlewareResponse } from './response/MiddlewareResponse.js';

/** An object that intercepts and validates/decorates the execution of something. */
export interface Middleware<Checked, Args extends readonly unknown[]>
  extends Lockable {
  /** Checks whether the checked object's execution should pass, given the execution arguments. */
  check(checked: Checked, ...args: Args): Awaitable<MiddlewareResponse>;

  /** Returns the priority of this object. */
  getPriority(): Priority;
}
