/*
 * MIT License
 *
 * Copyright (c) 2023 Amgelo563
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
    args: ExtractFilterArgs<Checked>,
  ): Promise<MiddlewareResponse> {
    const filter = checked.getFilter();
    if (!filter) return this.true();

    const result = await filter.check(checked, ...args);
    if (!result) return this.false();

    return this.true();
  }
}
