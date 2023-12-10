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

/** An error that wraps other errors that occur during features executions, helps to provide additional context about the execution. */
export class FeatureError<ErroredObject extends object> extends Error {
  public override readonly stack: string;

  protected readonly cause: ErroredObject;

  protected readonly error: Error;

  constructor(error: Error, cause: ErroredObject, message?: string) {
    super(message ?? `There was an error while running an object: \n${error}`);

    this.error = error;
    this.cause = cause;
    this.stack = `${this.message} ('${
      this.cause.constructor.name ?? 'unknown'
    }') \n${this.error.stack}`;
  }

  /** Returns the original thrown error. */
  public getError(): Error {
    return this.error;
  }

  /** Returns the object that caused the error. */
  public getCause(): ErroredObject {
    return this.cause;
  }
}
