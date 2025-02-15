import type {
  AnyEventSubscriber,
  EventDispatchArgs,
  EventSubscriberErrorHandler,
  EventSubscriberMiddleware,
  MiddlewareList,
  SyncEventDispatcher,
} from '@nyx-discord/core';
import type { Awaitable } from 'discord.js';

import { BasicErrorHandler } from '../../../error/BasicErrorHandler.js';
import { SubscriberMiddlewareList } from '../middleware/SubscriberMiddlewareList';
import { AbstractEventDispatcher } from './AbstractEventDispatcher.js';

export class BasicSyncEventDispatcher
  extends AbstractEventDispatcher
  implements SyncEventDispatcher
{
  protected syncTimeout: number | null = 10_000; // 10 seconds

  constructor(
    errorHandler: EventSubscriberErrorHandler,
    middleware: MiddlewareList<EventSubscriberMiddleware>,
    syncTimeout?: number | null,
  ) {
    super(errorHandler, middleware);
    if (syncTimeout !== undefined) {
      this.syncTimeout = syncTimeout;
    }
  }

  public static create(syncTimeout?: number | null): SyncEventDispatcher {
    return new BasicSyncEventDispatcher(
      BasicErrorHandler.createWithFallbackLogger((_error, _sub, [meta]) =>
        meta.getBot(true).getLogger(),
      ),
      SubscriberMiddlewareList.create(),
      syncTimeout,
    );
  }

  public async dispatch(
    subscribers: AnyEventSubscriber[],
    args: EventDispatchArgs,
  ): Promise<void> {
    const timeout = this.syncTimeout;
    const callFunction: (subscriber: AnyEventSubscriber) => Promise<void> =
      timeout === null
        ? async (subscriber) => await subscriber.handleEvent(...args)
        : async (subscriber) =>
            await this.executeWithTimeout(
              () => subscriber.handleEvent(...args),
              timeout,
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
    timeout: number,
  ): Promise<void> {
    if (timeout === 0) {
      return fn();
    }

    const timedPromise = new Promise<void>(function (resolve) {
      setTimeout(resolve, timeout);
    });

    return Promise.race([fn(), timedPromise]);
  }
}
