import type { Awaitable } from '../../types/Awaitable.js';
import type { MiddlewareResolvable } from '../MiddlewareResolvable';

/** An object that contains and checks {@link Middleware middlewares}. */
export interface MiddlewareList<
  MiddlewareType extends MiddlewareResolvable<any, any>,
  Checked = MiddlewareType extends MiddlewareResolvable<infer C, any>
    ? C
    : never,
  Args extends readonly unknown[] = MiddlewareType extends MiddlewareResolvable<
    any,
    infer A
  >
    ? A
    : never,
> {
  /** Checks all the stored {@link Middleware Middlewares} using the passed arguments and returns the result. */
  check(checked: Checked, ...args: Args): Awaitable<boolean>;

  /** Adds a middleware to the list. */
  add(...middlewares: MiddlewareType[]): this;

  /**
   * Removes a middleware from the list given its instance or ID.
   *
   * @throws {ObjectNotFoundError} If that middleware is not registered.
   */
  remove(middleware: MiddlewareType): boolean;

  /** Removes all the stored middlewares. */
  clear(): this;

  /** Returns all the stored middlewares. */
  getMiddlewares(): ReadonlyArray<MiddlewareType>;
}
