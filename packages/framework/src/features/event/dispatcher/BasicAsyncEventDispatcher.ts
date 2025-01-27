import type {
  AnyEventSubscriber,
  AsyncEventDispatcher,
  EventSubscriberErrorHandler,
  EventSubscriberMiddleware,
  MiddlewareList,
} from '@nyx-discord/core';

import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { SubscriberMiddlewareList } from '../middleware/SubscriberMiddlewareList';
import { AbstractEventDispatcher } from './AbstractEventDispatcher.js';

export class BasicAsyncEventDispatcher
  extends AbstractEventDispatcher
  implements AsyncEventDispatcher
{
  protected concurrencyLimit: number | null = 3;

  constructor(
    errorHandler: EventSubscriberErrorHandler,
    middleware: MiddlewareList<EventSubscriberMiddleware>,
    concurrencyLimit?: number | null,
  ) {
    super(errorHandler, middleware);
    if (concurrencyLimit !== undefined) {
      this.concurrencyLimit = concurrencyLimit;
    }
  }

  public static create(concurrencyLimit?: number | null): AsyncEventDispatcher {
    return new BasicAsyncEventDispatcher(
      BasicErrorHandler.createWithFallbackLogger((_error, _sub, [meta]) =>
        meta.getBot(true).getLogger(),
      ),
      SubscriberMiddlewareList.create(),
      concurrencyLimit,
    );
  }

  public async dispatch(
    subscribers: AnyEventSubscriber[],
    args: Parameters<AnyEventSubscriber['handleEvent']>,
  ): Promise<void> {
    const pendingPromises: Promise<void>[] = [];

    for (const subscriber of subscribers) {
      if (
        this.concurrencyLimit
        && pendingPromises.length >= this.concurrencyLimit
      ) {
        /** It's assumed that all promises in pendingPromises have a catch statement, so catching here is not needed. */
        await Promise.race(pendingPromises);
      }

      const [meta, ...unknownArgs] = args;

      const promise = Promise.resolve()
        .then(async () => {
          try {
            await this.checkMiddleware(subscriber, args);
          } catch (middlewareError) {
            throw this.wrapMiddlewareError(
              middlewareError as Error,
              subscriber,
              args,
            );
          }

          await subscriber.handleEvent(meta, ...unknownArgs);
        })
        .catch(async (error) => {
          await this.errorHandler.handle(error, subscriber, args);
        });

      pendingPromises.push(promise);
      void promise.finally(() => {
        const index = pendingPromises.indexOf(promise);
        if (index !== -1) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          pendingPromises.splice(index, 1);
        }
      });
    }

    await Promise.allSettled(pendingPromises);
  }

  public setConcurrencyLimit(limit: number | null): this {
    this.concurrencyLimit = limit;
    return this;
  }

  public getConcurrencyLimit(): number | null {
    return this.concurrencyLimit;
  }

  protected async checkMiddleware(
    subscriber: AnyEventSubscriber,
    args: Parameters<AnyEventSubscriber['handleEvent']>,
  ): Promise<boolean> {
    return Promise.resolve()
      .then(() => this.middleware.check(subscriber, ...args))
      .catch(async (error) => {
        const [meta] = args;

        const wrappedError = this.wrapMiddlewareError(
          error as Error,
          subscriber,
          args,
        );

        await this.errorHandler.handle(wrappedError, subscriber, [
          meta,
          ...args,
        ]);
        return false;
      });
  }
}
