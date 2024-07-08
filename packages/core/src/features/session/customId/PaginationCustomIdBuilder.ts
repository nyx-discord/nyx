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

import type { MetadatableCustomIdBuilderOptions } from '../../../customId/MetadatableCustomIdBuilder';
import { MetadatableCustomIdBuilder } from '../../../customId/MetadatableCustomIdBuilder';

/** Options to make a {@link PaginationCustomIdBuilder}. */
export interface PaginationCustomIdBuilderOptions
  extends MetadatableCustomIdBuilderOptions {
  page?: number;
}

/** A {@link MetadatableCustomIdBuilder} to build customIds that refer to a page. */
export class PaginationCustomIdBuilder extends MetadatableCustomIdBuilder {
  protected static readonly PageIndex = 0;

  protected page: number | null;

  constructor(options: PaginationCustomIdBuilderOptions) {
    super(options);

    this.page = options.page ?? null;
  }

  public static fromPaginatedString(
    string: string,
    separator: string,
    metadataSeparator: string,
  ): PaginationCustomIdBuilder | null {
    const builder = MetadatableCustomIdBuilder.fromMetadatableString(
      string,
      separator,
      metadataSeparator,
    );

    if (!builder) return null;
    const pageString = builder.getMetaAt(PaginationCustomIdBuilder.PageIndex);
    let page: number | undefined;

    if (pageString) {
      const pageNumber = parseInt(pageString);

      page = isNaN(pageNumber) ? undefined : pageNumber;
    }

    return new PaginationCustomIdBuilder({
      namespace: builder.getNamespace(),
      objectId: builder.getObjectId(),
      metadataSeparator: metadataSeparator,
      separator,
      page,
    });
  }

  public cloneSetPage(page: number): this {
    return this.clone().setPage(page) as this;
  }

  public setPage(page: number): this {
    this.setMetaAt(PaginationCustomIdBuilder.PageIndex, page);
    this.page = page;

    return this;
  }

  public getPage(): number | null {
    return this.page;
  }

  public setToNextPage(): this {
    if (this.page === null) return this;

    return this.setPage(this.page + 1);
  }

  public setToPreviousPage(): this {
    if (this.page === null) return this;

    return this.setPage(this.page - 1);
  }

  public cloneSetNextPage(): this {
    return this.clone().setToNextPage() as this;
  }

  public cloneSetPreviousPage(): this {
    return this.clone().setToPreviousPage() as this;
  }

  public override clone(): PaginationCustomIdBuilder {
    return new PaginationCustomIdBuilder({
      namespace: this.namespace,
      objectId: this.objectId,
      metadataSeparator: this.metaSeparator,
      separator: this.separator,
      page: this.page ?? undefined,
    });
  }
}
