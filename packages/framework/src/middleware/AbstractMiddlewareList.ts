/*
 * MIT License
 *
 * Copyright (c) 2024 Amgelo563
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { Middleware, MiddlewareList, Tail } from '@nyx-discord/core';

export abstract class AbstractMiddlewareList<
  MiddlewareType extends Middleware<any, any>,
> implements MiddlewareList<MiddlewareType>
{
  protected readonly middlewares: MiddlewareType[] = [];

  public async check(
    checked: Parameters<MiddlewareType['check']>[0],
    ...args: Tail<Parameters<MiddlewareType['check']>>
  ): Promise<boolean> {
    if (!this.middlewares.length) return true;

    for (const middleware of this.middlewares) {
      try {
        const result = await middleware.check(checked, ...args);
        if (!result.checkNext || !result.allowed) return result.allowed;
      } catch (error) {
        throw this.wrapError(middleware, error as Error, checked, ...args);
      }
    }
    return true;
  }

  public add(middleware: MiddlewareType): this {
    const priority = middleware.getPriority();
    for (const [index, storedMiddleware] of this.middlewares.entries()) {
      if (storedMiddleware.getPriority() > priority) continue;
      this.middlewares.splice(index, 0, middleware);
      return this;
    }
    this.middlewares.push(middleware);

    return this;
  }

  public bulkAdd(...middlewares: MiddlewareType[]): this {
    for (const middleware of middlewares) {
      this.add(middleware);
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
    checked: Parameters<MiddlewareType['check']>[0],
    ...args: Tail<Parameters<MiddlewareType['check']>>
  ): Error;
}
