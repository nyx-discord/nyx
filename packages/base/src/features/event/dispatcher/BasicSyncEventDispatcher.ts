import {
  type AnyEventSubscriber,
  type EventDispatchArgs,
  type EventSubscriberErrorHandler,
  type EventSubscriberMiddleware,
  type MiddlewareList,
  type SyncEventDispatcher,
  TypedFields,
} from '@nyx-discord/types';
import type { Awaitable } from '@nyx-discord/types';
import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { SubscriberMiddlewareList } from '../middleware/SubscriberMiddlewareList.js';
import { AbstractEventDispatcher } from './AbstractEventDispatcher.js';

type SyncEventDispatcherOptions = {
  errorHandler: EventSubscriberErrorHandler;
  middleware: MiddlewareList<EventSubscriberMiddleware>;
  syncTimeout?: number;
};

export class BasicSyncEventDispatcher
  extends AbstractEventDispatcher
  implements SyncEventDispatcher
{
  protected syncTimeout: number | null = 10_000; // 10 seconds

  constructor(options: SyncEventDispatcherOptions) {
    super(options.errorHandler, options.middleware);
    if (options.syncTimeout !== undefined) {
      this.syncTimeout = options.syncTimeout;
    }
  }

  public static create(options?: {
    syncTimeout?: number;
    injections?: Partial<Omit<SyncEventDispatcherOptions, 'syncTimeout'>>;
  }): SyncEventDispatcher {
    const constructorOptions = options?.injections ?? {};

    return new this({
      errorHandler:
        constructorOptions.errorHandler
        ?? BasicErrorHandler.createWithFallbackLogger((_error, _sub, [meta]) =>
          TypedFields.Bot.get(meta, true).getLogger(),
        ),
      middleware:
        constructorOptions.middleware ?? SubscriberMiddlewareList.create(),
      syncTimeout: options?.syncTimeout,
    });
  }

  public async dispatch(
    subscribers: AnyEventSubscriber[],
    args: EventDispatchArgs,
  ): Promise<void> {
    const callFunction: (subscriber: AnyEventSubscriber) => Promise<void> =
      this.syncTimeout === null
        ? async (subscriber) => await subscriber.handleEvent(...args)
        : async (subscriber) =>
            await this.executeWithTimeout(
              () => subscriber.handleEvent(...args),
              (error) =>
                this.errorHandler.handle(error as Error, subscriber, args),
            );

    for (const subscriber of subscribers) {
      try {
        const middlewareSuccess = await this.middleware.check(
          subscriber,
          ...args,
        );
        if (!middlewareSuccess) {
          continue;
        }
      } catch (error) {
        const wrappedError = this.wrapMiddlewareError(
          error as Error,
          subscriber,
          args,
        );

        await this.errorHandler.handle(wrappedError, subscriber, args);
      }

      try {
        await callFunction(subscriber);
      } catch (error) {
        await this.errorHandler.handle(error as Error, subscriber, args);
      }
    }
  }

  public setSyncTimeout(timeout: number | null): this {
    this.syncTimeout = timeout !== null ? (timeout < 0 ? 0 : timeout) : null;
    return this;
  }

  public getSyncTimeout(): number | null {
    return this.syncTimeout;
  }

  /** Resolves once either the given function concluded executing or the given timeout has passed. */
  protected async executeWithTimeout(
    fn: () => Awaitable<void>,
    onLateError: (error: unknown) => unknown,
  ): Promise<void> {
    if (this.syncTimeout === null || this.syncTimeout === 0) {
      return fn();
    }

    const fnPromise = Promise.resolve().then(fn).catch(onLateError);

    // saving to avoid issues with setTimeout
    const timeout = this.syncTimeout;
    const timedPromise = new Promise<void>(function (resolve) {
      setTimeout(resolve, timeout);
    });

    await Promise.race([fnPromise, timedPromise]);
  }
}
