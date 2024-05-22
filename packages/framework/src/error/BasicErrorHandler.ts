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

import { Collection } from '@discordjs/collection';
import type {
  AnyClass,
  Constructor,
  ErrorConsumer,
  ErrorConsumerCollection,
  ErrorHandler,
  NyxLogger,
  ReadonlyCollectionFrom,
} from '@nyx-discord/core';

export class BasicErrorHandler<
  ErroredObject extends object,
  Args extends unknown[],
> implements ErrorHandler<ErroredObject, Args>
{
  protected fallbackConsumer: ErrorConsumer<object, ErroredObject, Args>;

  protected readonly consumers: ErrorConsumerCollection<ErroredObject, Args>;

  constructor(
    consumers: ErrorConsumerCollection<ErroredObject, Args>,
    fallbackConsumer: ErrorConsumer<object, ErroredObject, Args>,
  ) {
    this.consumers =
      consumers
      ?? (new Collection() as ErrorConsumerCollection<ErroredObject, Args>);
    this.fallbackConsumer = fallbackConsumer;
  }

  public static DefaultFallbackLogger<
    ErroredObject extends object,
    Args extends unknown[],
  >(error: object, erroredObject: ErroredObject, args: Args): void {
    console.error(
      `An error ocurred while executing ${erroredObject} with arguments ${args}.`,
      error,
    );
  }

  public static create<
    ErroredObject extends object,
    Args extends unknown[],
  >(): ErrorHandler<ErroredObject, Args> {
    return new BasicErrorHandler<ErroredObject, Args>(
      new Collection(),
      BasicErrorHandler.DefaultFallbackLogger,
    );
  }

  public static createWithFallbackLogger<
    ErroredObject extends object,
    Args extends unknown[],
  >(
    fallbackLoggerGetter: (
      error: object,
      erroredObject: ErroredObject,
      args: Args,
    ) => NyxLogger,
  ): ErrorHandler<ErroredObject, Args> {
    const handler = BasicErrorHandler.create<ErroredObject, Args>();

    handler.setFallbackConsumer((error, object, args) => {
      const logger = fallbackLoggerGetter(error, object, args);
      logger.error(error, object, args);
    });

    return handler;
  }

  public async handle(
    error: object,
    erroredObject: ErroredObject,
    args: Args,
  ): Promise<void> {
    const consumer = this.findConsumerOf(error);
    await this.useConsumer(consumer, error, erroredObject, args);
  }

  public removeConsumerOf(error: AnyClass): void {
    this.consumers.delete(error);
  }

  public setConsumer<ErrorType extends AnyClass>(
    error: ErrorType,
    consumer: ErrorConsumer<InstanceType<ErrorType>, ErroredObject, Args>,
  ): void {
    this.consumers.set(
      error,
      consumer as ErrorConsumer<AnyClass, ErroredObject, Args>,
    );
  }

  public hasConsumer(error: AnyClass): boolean {
    return this.consumers.has(error.constructor as Constructor);
  }

  public getFallbackConsumer(): ErrorConsumer<object, ErroredObject, Args> {
    return this.fallbackConsumer;
  }

  public setFallbackConsumer(
    consumer: ErrorConsumer<object, ErroredObject, Args>,
  ): void {
    this.fallbackConsumer = consumer;
  }

  public getConsumers(): ReadonlyCollectionFrom<
    ErrorConsumerCollection<ErroredObject, Args>
  > {
    return this.consumers;
  }

  public clear(): void {
    this.consumers.clear();
  }

  protected findConsumerOf<ErrorType extends object>(
    error: ErrorType,
  ): ErrorConsumer<ErrorType, ErroredObject, Args> {
    let originalErrorClass = Object.getPrototypeOf(error).constructor;
    const originalErrorConsumer = this.consumers.get(originalErrorClass);
    if (originalErrorConsumer) return originalErrorConsumer;

    while (originalErrorClass !== null) {
      const consumer = this.consumers.get(originalErrorClass);
      if (consumer) return consumer;

      originalErrorClass = Object.getPrototypeOf(originalErrorClass);
    }

    return this.fallbackConsumer;
  }

  protected async useConsumer<ErrorType extends object>(
    consumer: ErrorConsumer<ErrorType, ErroredObject, Args>,
    error: ErrorType,
    erroredObject: ErroredObject,
    args: Args,
  ) {
    await consumer(error, erroredObject, args);
  }
}
