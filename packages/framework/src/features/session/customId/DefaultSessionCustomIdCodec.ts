import type {
  PaginationSession,
  Session,
  SessionCustomIdCodec,
} from '@nyx-discord/core';
import { PaginationCustomIdBuilder } from '@nyx-discord/core';
import { IdentifiableCustomIdCodec } from '../../../customId/IdentifiableCustomIdCodec';

export class DefaultSessionCustomIdCodec
  extends IdentifiableCustomIdCodec<Session<unknown>>
  implements SessionCustomIdCodec
{
  public static readonly DefaultNamespace = 'SSN';

  constructor(
    prefix: string = DefaultSessionCustomIdCodec.DefaultNamespace,
    separator: string = DefaultSessionCustomIdCodec.DefaultSeparator,
    metadataSeparator: string = DefaultSessionCustomIdCodec.DefaultMetadataSeparator,
  ) {
    super(prefix, separator, metadataSeparator);
  }

  public static create(): SessionCustomIdCodec {
    return new DefaultSessionCustomIdCodec();
  }

  public extractPageFromCustomId(customId: string): number | null {
    const builder = PaginationCustomIdBuilder.fromPaginatedString(
      customId,
      this.separator,
      this.metadataSeparator,
    );

    return builder ? builder.getPage() : null;
  }

  public createPageCustomIdBuilder(
    session: PaginationSession<unknown>,
    page?: number,
  ): PaginationCustomIdBuilder {
    const objectId = session.getId();

    return new PaginationCustomIdBuilder({
      namespace: this.namespace,
      objectId,
      metadataSeparator: this.metadataSeparator,
      separator: this.separator,
      page,
    });
  }
}
