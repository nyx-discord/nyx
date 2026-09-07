import {
  type AnyEventSubscriber,
  type AsyncEventDispatcher,
  type EventSubscriberErrorHandler,
  type EventSubscriberMiddleware,
  type MiddlewareList,
  TypedFields,
} from '@nyx-discord/types';
import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { SubscriberMiddlewareList } from '../middleware/SubscriberMiddlewareList.js';
import { AbstractEventDispatcher } from './AbstractEventDispatcher.js';

type AsyncEventDispatcherOptions = {
  errorHandler: EventSubscriberErrorHandler;
  middleware: MiddlewareList<EventSubscriberMiddleware>;
  concurrencyLimit?: number;
};

export class BasicAsyncEventDispatcher
  extends AbstractEventDispatcher
  implements AsyncEventDispatcher
{
  protected concurrencyLimit: number | null = 3;

  constructor(options: AsyncEventDispatcherOptions) {
    super(options.errorHandler, options.middleware);
    if (options.concurrencyLimit !== undefined) {
      this.concurrencyLimit = options.concurrencyLimit;
    }
  }

  public static create(options?: {
    concurrencyLimit?: number;
    injections?: Partial<Omit<AsyncEventDispatcherOptions, 'concurrencyLimit'>>;
  }): AsyncEventDispatcher {
    const constructorOptions = options?.injections ?? {};

    return new this({
      errorHandler:
        constructorOptions.errorHandler
        ?? BasicErrorHandler.createWithFallbackLogger((_error, _sub, [meta]) =>
          TypedFields.Bot.get(meta, true).getLogger(),
        ),
      middleware:
        constructorOptions.middleware ?? SubscriberMiddlewareList.create(),
      concurrencyLimit: options?.concurrencyLimit,
    });
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
            const passed = await this.checkMiddleware(subscriber, args);
            if (!passed) return;
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
          // An array of promises is actually intended here
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
        const wrappedError = this.wrapMiddlewareError(
          error as Error,
          subscriber,
          args,
        );

        await this.errorHandler.handle(wrappedError, subscriber, args);
        return false;
      });
  }
}
