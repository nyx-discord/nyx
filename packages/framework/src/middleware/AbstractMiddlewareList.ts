import type {
  MiddlewareList,
  MiddlewareResolvable,
  Priority,
} from '@nyx-discord/core';
import { PriorityEnum } from '@nyx-discord/core';

export abstract class AbstractMiddlewareList<
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
> implements MiddlewareList<MiddlewareType>
{
  protected readonly middlewares: MiddlewareType[] = [];

  public async check(checked: Checked, ...args: Args): Promise<boolean> {
    if (!this.middlewares.length) return true;

    for (const middleware of this.middlewares) {
      try {
        const result =
          typeof middleware === 'object'
            ? await middleware.check(checked, ...args)
            : await middleware(checked, ...args);
        if (!result.checkNext || !result.allowed) return result.allowed;
      } catch (error) {
        throw this.wrapError(middleware, error as Error, checked, ...args);
      }
    }
    return true;
  }

  public add(...middlewares: MiddlewareType[]): this {
    for (const middleware of middlewares) {
      const priority = this.extractPriority(middleware);
      for (const [index, storedMiddleware] of this.middlewares.entries()) {
        if (this.extractPriority(storedMiddleware) > priority) continue;
        this.middlewares.splice(index, 0, middleware);
        return this;
      }
      this.middlewares.push(middleware);
    }

    return this;
  }

  public clear(): this {
    this.middlewares.length = 0;
    return this;
  }

  public getMiddlewares(): ReadonlyArray<MiddlewareType> {
    return this.middlewares;
  }

  public remove(middleware: MiddlewareType): boolean {
    const index = this.middlewares.findIndex((m) => middleware === m);
    if (index === -1) {
      return false;
    }

    this.middlewares.splice(index, 1);
    return true;
  }

  /**
   * Wraps an error based on it, the errored middleware and arguments.
   *
   * Overriden in subclasses to return a custom error instance with additional
   * information about the feature.
   */
  protected abstract wrapError(
    erroredMiddleware: MiddlewareType,
    error: Error,
    checked: Checked,
    ...args: Args
  ): Error;

  /** Extracts the priority from a middleware. Defaults to `PriorityEnum.Normal` for callback middlewares. */
  protected extractPriority(middleware: MiddlewareType): Priority {
    return typeof middleware === 'object'
      ? middleware.getPriority()
      : PriorityEnum.Normal;
  }
}
