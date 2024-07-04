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

import type { CustomIdBuilder, CustomIdCodec } from '@nyx-discord/core';
import {
  AssertionError,
  MetadatableCustomIdBuilder,
  StringIterator,
} from '@nyx-discord/core';

export abstract class AbstractCustomIdCodec<Serialized>
  implements CustomIdCodec<Serialized>
{
  public static readonly DefaultSeparator: string = '႞';

  public static readonly DefaultDataSeparator: string = '୵';

  protected readonly namespace: string;

  protected readonly separator: string;

  protected readonly dataSeparator: string;

  constructor(namespace: string, separator: string, dataSeparator: string) {
    if (separator === dataSeparator) {
      throw new AssertionError(
        'The data separator cannot be the same as the string separator.',
      );
    }

    this.namespace = namespace;
    this.separator = separator;
    this.dataSeparator = dataSeparator;
  }

  public serializeToCustomId(serialized: Serialized): string {
    return this.createCustomIdBuilder(serialized).build();
  }

  public createCustomIdBuilder(serialized: Serialized): CustomIdBuilder {
    const id = this.getIdOf(serialized);

    return new MetadatableCustomIdBuilder({
      namespace: this.namespace,
      objectId: id,
      dataSeparator: this.dataSeparator,
      separator: this.separator,
    });
  }

  public createIteratorFromCustomId(customId: string): StringIterator | null {
    const builder = MetadatableCustomIdBuilder.fromMetadatableString(
      customId,
      this.separator,
      this.dataSeparator,
    );

    if (!builder || builder.getNamespace() !== this.namespace) return null;

    const [...tokens] = builder.getTokens();

    return new StringIterator(tokens);
  }

  public deserializeToObjectId(customId: string): string | null {
    const builder = MetadatableCustomIdBuilder.fromMetadatableString(
      customId,
      this.separator,
      this.dataSeparator,
    );

    if (!builder || builder.getNamespace() !== this.namespace) return null;

    return builder ? builder.getObjectId() : null;
  }

  public getNamespace(): string {
    return this.namespace;
  }

  public getSeparator(): string {
    return this.separator;
  }

  public getDataSeparator(): string {
    return this.dataSeparator;
  }

  /** Extracts the ID from the serialized object. */
  protected abstract getIdOf(serialized: Serialized): string;
}
