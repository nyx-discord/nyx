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
      tokens: builder.getTokens() as string[],
    });
  }

  public cloneSetPage(page: number): this {
    return this.clone().setPage(page) as this;
  }

  public setPage(page: number): this {
    this.metadata[PaginationCustomIdBuilder.PageIndex] = page.toString();
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
      tokens: this.tokens,
    });
  }
}
