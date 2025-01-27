import type { Awaitable } from 'discord.js';
import type { Tail } from '../../types/Tail';
import type { Middleware } from '../Middleware.js';

/** An object that contains and checks {@link Middleware middlewares}. */
export interface MiddlewareList<MiddlewareType extends Middleware<any, any>> {
  /** Checks all the stored {@link Middleware Middlewares} using the passed arguments and returns the result. */
  check(
    checked: Parameters<MiddlewareType['check']>[0],
    ...args: Tail<Parameters<MiddlewareType['check']>>
  ): Awaitable<boolean>;

  /** Adds a middleware to the list. */
  add(middleware: MiddlewareType): this;

  /**
   * Adds a list of middlewares to the list. Alias for mapping
   * the array to {@link add}.
   */
  bulkAdd(...middlewares: MiddlewareType[]): this;

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
