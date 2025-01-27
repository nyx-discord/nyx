import { AssertionError } from '../errors/AssertionError';
import { IllegalDuplicateError } from '../errors/IllegalDuplicateError';
import type { CustomIdBuilderOptions } from './CustomIdBuilder';
import { CustomIdBuilder } from './CustomIdBuilder';

export interface MetadatableCustomIdBuilderOptions
  extends CustomIdBuilderOptions {
  namespace: string;
  objectId: string;
  metadataSeparator: string;
}

export class MetadatableCustomIdBuilder extends CustomIdBuilder {
  protected readonly namespace: string;

  protected readonly objectId: string;

  protected readonly metadata: string[];

  protected readonly metaSeparator: string;

  constructor(options: MetadatableCustomIdBuilderOptions) {
    super(options);

    if (options.metadataSeparator === options.separator) {
      throw new AssertionError(
        'The metadata separator cannot be the same as the string separator.',
      );
    }

    this.namespace = options.namespace;
    this.objectId = options.objectId;
    this.metaSeparator = options.metadataSeparator;

    this.metadata = [];
  }

  public static fromMetadatableString(
    string: string,
    separator: string,
    metadataSeparator: string,
  ): MetadatableCustomIdBuilder | null {
    const tokens = string.split(separator);
    if (!tokens.length) return null;

    const [data, ...extraTokens] =
      tokens.length === 2 && tokens[1] === '' ? [tokens[0]] : tokens;
    const [namespace, objectId, ...metadata] = data.split(metadataSeparator);
    if (!namespace || !objectId) return null;

    const builder = new MetadatableCustomIdBuilder({
      namespace,
      objectId,
      separator,
      metadataSeparator,
    });

    builder.pushMeta(...metadata);
    return builder.push(...extraTokens);
  }

  /**
   * Pushes a value to this builder's {@link metadata}.
   *
   * @returns {number} The index where the first value was pushed.
   */
  public pushMeta(...values: (string | number)[]): number {
    const currentLength = this.metadata.length;

    this.metadata.push(
      ...values.map((value) => {
        const string = value.toString();
        this.validate(string);
        return string;
      }),
    );

    return currentLength;
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

  public getMetadataSeparator(): string {
    return this.metaSeparator;
  }

  public clone(): MetadatableCustomIdBuilder {
    const options: MetadatableCustomIdBuilderOptions = {
      namespace: this.namespace,
      objectId: this.objectId,
      metadataSeparator: this.metaSeparator,
      separator: this.separator,
      tokens: this.tokens,
    };

    return new MetadatableCustomIdBuilder(options);
  }

  public build(): string {
    const dataValues = [this.namespace, this.objectId, ...this.metadata];
    const dataString = dataValues.join(this.metaSeparator);

    const joinedTokens = super.build();

    return `${dataString}${this.separator}${joinedTokens}`;
  }

  protected override validate(value: string): void {
    if (value.includes(this.metaSeparator)) {
      throw new AssertionError(
        `The value "${value}" cannot contain the metadata separator "${this.metaSeparator}".`,
      );
    }

    super.validate(value);
  }
}
