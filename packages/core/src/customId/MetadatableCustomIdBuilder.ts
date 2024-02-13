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

import { AssertionError } from '../errors/AssertionError';
import { IllegalDuplicateError } from '../errors/IllegalDuplicateError';
import type { CustomIdBuilderOptions } from './CustomIdBuilder';
import { CustomIdBuilder } from './CustomIdBuilder';

export interface MetadatableCustomIdBuilderOptions
  extends CustomIdBuilderOptions {
  namespace: string;
  objectId: string;
  dataSeparator: string;
}

export class MetadatableCustomIdBuilder extends CustomIdBuilder {
  protected readonly namespace: string;

  protected readonly objectId: string;

  protected readonly metadata: string[];

  protected readonly dataSeparator: string;

  constructor(options: MetadatableCustomIdBuilderOptions) {
    super(options);

    if (options.dataSeparator === options.separator) {
      throw new AssertionError(
        'The data separator cannot be the same as the string separator.',
      );
    }

    this.namespace = options.namespace;
    this.objectId = options.objectId;
    this.dataSeparator = options.dataSeparator;

    this.metadata = [];
  }

  public static fromMetadatableString(
    string: string,
    separator: string,
    dataSeparator: string,
  ): MetadatableCustomIdBuilder | null {
    const tokens = string.split(separator);
    if (!tokens.length) return null;

    const [data, ...extraTokens] = tokens;
    const [namespace, objectId, ...metadata] = data.split(dataSeparator);
    if (!namespace || !objectId) return null;

    const builder = new MetadatableCustomIdBuilder({
      namespace,
      objectId,
      separator,
      dataSeparator,
    });

    return builder.pushMeta(...metadata).push(...extraTokens);
  }

  /** Pushes a value to this builder's {@link metadata}. */
  public pushMeta(...values: (string | number)[]): this {
    this.metadata.push(
      ...values.map((value) => {
        const string = value.toString();
        this.validate(string);
        return string;
      }),
    );
    return this;
  }

  /**
   * Sets a value at a given index.
   *
   * @throws {IllegalDuplicateError} If a value already exists at that index.
   */
  public setMetaAt(index: number, value: string | number): this {
    if (this.metadata[index] !== undefined) {
      throw new IllegalDuplicateError(
        this.metadata[index],
        value,
        `Metadata token at index ${index} already exists.`,
      );
    }
    const string = value.toString();
    this.validate(string);
    this.metadata[index] = string;

    return this;
  }

  public getMetaAt(index: number): string | null {
    return this.metadata[index] ?? null;
  }

  public getNamespace(): string {
    return this.namespace;
  }

  public getObjectId(): string {
    return this.objectId;
  }

  public getMetadata(): string[] {
    return this.metadata;
  }

  public clone(): MetadatableCustomIdBuilder {
    const options: MetadatableCustomIdBuilderOptions = {
      namespace: this.namespace,
      objectId: this.objectId,
      dataSeparator: this.dataSeparator,
      separator: this.separator,
    };

    return new MetadatableCustomIdBuilder(options);
  }

  public build(): string {
    const dataValues = [this.namespace, this.objectId, ...this.metadata];
    const dataString = dataValues.join(this.dataSeparator);

    const joinedTokens = super.build();

    return `${dataString}${this.separator}${joinedTokens}`;
  }

  protected override validate(value: string): void {
    if (value.includes(this.dataSeparator)) {
      throw new AssertionError(
        `The value "${value}" cannot contain the data separator "${this.dataSeparator}".`,
      );
    }

    super.validate(value);
  }
}
