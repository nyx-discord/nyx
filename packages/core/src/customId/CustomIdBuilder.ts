import { IllegalDuplicateError } from '../errors/IllegalDuplicateError';

export interface CustomIdBuilderOptions {
  tokens?: (string | number)[];
  separator: string;
}

/** An object to build strings by joining tokens together. */
export class CustomIdBuilder {
  public static readonly LengthLimit: number = 100;

  /** The input tokens used to build the customId. */
  protected readonly tokens: string[] = [];

  /** The string used to separate tokens when joining the string together. */
  protected readonly separator;

  constructor(options: CustomIdBuilderOptions) {
    this.separator = options.separator;
    if (options.tokens) {
      this.tokens.push(...options.tokens.map((token) => token.toString()));
    }
  }

  public static fromString(string: string, separator: string): CustomIdBuilder {
    return new CustomIdBuilder({ tokens: string.split(separator), separator });
  }

  /** Pushes a value to this builder's {@link tokens}. */
  public push(...values: (string | number)[]): this {
    this.tokens.push(
      ...values.map((value) => {
        const string = value.toString();
        this.validate(string);
        return string;
      }),
    );
    return this;
  }

  /**
   * Clones the builder and pushes a value to the clone's {@link tokens}.
   *
   * Equivalent of `builder.clone().push(...values)`.
   */
  public clonePush(...values: (string | number)[]): this {
    const clone = this.clone();

    clone.push(...values);
    return clone as this;
  }

  /**
   * Sets a value at a given index.
   *
   * @throws {IllegalDuplicateError} If a value already exists at that index.
   */
  public setAt(index: number, value: string | number): this {
    if (this.tokens[index] !== undefined) {
      throw new IllegalDuplicateError(
        this.tokens[index],
        value,
        `Token at index ${index} already exists.`,
      );
    }
    const string = value.toString();
    this.validate(string);
    this.tokens[index] = string;

    return this;
  }

  /**
   * Clones the builder and sets a value at a given index on the clone.
   *
   * Equivalent of `builder.clone().setAt(index, value)`.
   *
   * @throws {IllegalDuplicateError} If a value already exists at that index.
   */
  public cloneSetAt(index: number, value: string | number): this {
    const clone = this.clone();

    clone.setAt(index, value);
    return clone as this;
  }

  /** Builds the string by joining all the passed {@link tokens}. */
  public build(unsafe: boolean = false): string {
    const result = this.tokens.join(this.separator);

    if (result.length > CustomIdBuilder.LengthLimit && !unsafe) {
      throw new Error(
        `Cannot safely build a customId with more than ${CustomIdBuilder.LengthLimit} tokens:\n${result}`,
      );
    }
    return result;
  }

  /** Returns this builder's currently stored {@link tokens}. */
  public getTokens(): ReadonlyArray<string> {
    return this.tokens;
  }

  /** Returns this builder's {@link separator}. */
  public getSeparator(): string {
    return this.separator;
  }

  /** Clone this instance to a new builder. */
  public clone(): CustomIdBuilder {
    return new CustomIdBuilder({
      tokens: this.tokens,
      separator: this.separator,
    });
  }

  public toString(): string {
    return this.build();
  }

  /** Validates a given token. */
  protected validate(token: string) {
    if (token.includes(this.separator)) {
      throw new IllegalDuplicateError(
        this.separator,
        token,
        'Cannot push a token that contains the separator.',
      );
    }
  }
}
