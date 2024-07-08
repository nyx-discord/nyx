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
