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

/**
 * An error for duplicate objects.
 *
 * Typically when an object tries to be registered, but another with that ID already exists.
 */
export class IllegalDuplicateError<Of> extends Error {
  protected readonly original: Of;

  protected readonly duplicate: Of;

  constructor(original: Of, duplicate: Of, message?: string) {
    super(`An illegal duplicate was found${message ? `: ${message}` : ''}`);
    this.original = original;
    this.duplicate = duplicate;
  }

  /** Get the original object that was already in place. */
  public getOriginal(): Of {
    return this.original;
  }

  /** Get the duplicate that caused the error. */
  public getDuplicate(): Of {
    return this.duplicate;
  }
}
