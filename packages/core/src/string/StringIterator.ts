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

/** An object for iterating through a string given a separator token. */
export class StringIterator {
  /** The tokens obtained when splitting the string. */
  protected readonly tokens: string[];

  /** The current index the iterator is currently at. */
  protected index = 0;

  constructor(tokens: string[]) {
    this.tokens = tokens;
  }

  /** Returns the length of this iterator's token array. */
  public get size(): number {
    return this.tokens.length;
  }

  public static fromString(str: string, separator: string): StringIterator {
    const tokens = str.split(separator);

    return new StringIterator(tokens);
  }

  /**
   * Creates a default StringIterator with the specified string and set its index to the specified position,
   * returning the created iterator.
   *
   * Alias for `StringIterator.fromString(string, separator).setAt(index)`.
   */
  public static fromStringAt(
    string: string,
    separator: string,
    index: number,
  ): StringIterator {
    const iterator = StringIterator.fromString(string, separator);
    return iterator.setAt(index);
  }

  /**
   * Returns the string at the current position.
   * @param {boolean} [force=true] Whether to force the resolution of a string at the current position,
   *                               mainly for typing purposes.
   *                               If no string is found and it's set to `true`, an error is thrown. Otherwise, `null` is returned.
   * @throws {RangeError}          If {@link force} is `true`, and no string at this position exists.
   */
  public get(force?: true): string;
  public get(force: false): string | null;
  public get(force = true): string | null {
    const value = this.tokens[this.index];
    if (!value && force) {
      throw new RangeError(
        `Tried to access index ${this.index} of array [${this.tokens}], but no value was found.`,
      );
    }
    return value ?? null;
  }

  /** Increments the index and get the string at the new position. */
  public next(force: true): string;
  public next(force?: false): string | null;
  public next(force = false): string | null {
    if (!this.hasNext()) return null;
    this.index += 1;
    return this.get(force as true);
  }

  /** Decrements the index and get the string at the new position. */
  public previous(force: true): string;
  public previous(force?: false): string | null;
  public previous(force = false): string | null {
    if (!this.hasPrevious()) return null;
    this.index -= 1;
    return this.get(force as true);
  }

  /** Returns the next position, based on the current index. */
  public getNextPosition(): number {
    return this.index + 1;
  }

  /** Returns the previous position, based on the current index. */
  public getPreviousPosition(): number {
    return this.index - 1;
  }

  /** Returns whether there's a previous position to the current one. */
  public hasPrevious(): boolean {
    return this.index !== 0;
  }

  /** Returns whether there's a next position to the current one. */
  public hasNext(): boolean {
    return !(this.index === this.tokens.length);
  }

  /**
   * Returns the string at the specified position. Uses {@link Array#at}.
   *
   * @param {number}  position     The position of the token to get.
   * @param {boolean} [force=true] Whether to force the resolution of a string at the specified position,
   *                               mainly for typing purposes.
   *                               If no token is found and it's set to `true`, an error is thrown. Otherwise, `null` is returned.
   * @throws {RangeError}          If {@link force} is `true`, and no token at this position exists.
   */
  public getAt(position: number, force: true): string;
  public getAt(position: number, force?: false): string | null;
  public getAt(position: number, force = false): string | null {
    const tokenAt = this.tokens.at(position);
    if (!tokenAt && force) {
      throw new RangeError(
        `Tried to access index ${position} of array [${this.tokens}], but no value was found.`,
      );
    }
    return tokenAt ?? null;
  }

  /** Maps the tokens of this iterator to an array. */
  public map<T>(
    callback: (value: string, index: number, array: string[]) => T,
  ): T[] {
    return this.tokens.map(callback);
  }

  /** Maps the tokens of this iterator to a new iterator. */
  public mapToIterator(
    callback: (value: string, index: number, array: string[]) => string,
  ): StringIterator {
    const newTokens = this.tokens.map(callback);
    return new StringIterator(newTokens);
  }

  /** Filters the tokens of this iterator to an array. */
  public filter(
    callback: (value: string, index: number, array: string[]) => boolean,
  ): string[] {
    return this.tokens.filter(callback);
  }

  /** Filters the tokens of this iterator to a new iterator. */
  public filterToIterator(
    callback: (value: string, index: number, array: string[]) => string,
  ): StringIterator {
    const newTokens = this.tokens.filter(callback);
    return new StringIterator(newTokens);
  }

  /** Sets the current position to a new one. */
  public setAt(position: number): this {
    this.index = position;
    return this;
  }

  /** Clones this instance to a new iterator with this same data. */
  public clone(): StringIterator {
    return new StringIterator(this.tokens).setAt(this.index);
  }

  /** Returns the raw input string. */
  public toString(): string {
    return this.tokens.join();
  }

  /** Returns the extracted tokens from the string. */
  public getTokens(): ReadonlyArray<string> {
    return this.tokens;
  }

  /** Returns the current position. */
  public getPosition(): number {
    return this.index;
  }

  public join(separator: string): string {
    return this.tokens.join(separator);
  }

  public *[Symbol.iterator](): IterableIterator<string> {
    for (const value of this.tokens) {
      yield value;
    }
  }
}
