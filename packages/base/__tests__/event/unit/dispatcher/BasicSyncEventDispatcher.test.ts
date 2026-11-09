import { describe, expect, it, test, vi } from 'vitest';
import { BasicSyncEventDispatcher } from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';
import { StubEventMiddlewareList } from '../../mocks/StubEventMiddlewareList';
import { StubEventErrorHandler } from '../../mocks/StubEventErrorHandler';

describe('BasicSyncEventDispatcher', () => {
  it('SHOULD create an instance of itself', () => {
    const dispatcher = BasicSyncEventDispatcher.create();

    expect(dispatcher).toBeInstanceOf(BasicSyncEventDispatcher);
  });

  describe('getErrorHandler', () => {
    test('GIVEN a created dispatcher THEN has an error handler', () => {
      const dispatcher = BasicSyncEventDispatcher.create();

      expect(dispatcher.getErrorHandler()).toBeDefined();
    });
  });

  describe('getMiddleware', () => {
    test('GIVEN a created dispatcher THEN has middleware list', () => {
      const dispatcher = BasicSyncEventDispatcher.create();

      expect(dispatcher.getMiddleware()).toBeDefined();
      expect(dispatcher.getMiddleware().getMiddlewares().length).toBeGreaterThan(0);
    });
  });

  describe('dispatch', () => {
    test('GIVEN middleware passes THEN calls subscriber handleEvent', async () => {
      const middleware = StubEventMiddlewareList.create();
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicSyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(subscriber.handleEvent).toHaveBeenCalledWith(meta, 'test-data');
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });

    test('GIVEN middleware returns false THEN does not call subscriber', async () => {
      const middleware = StubEventMiddlewareList.create(false);
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicSyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(subscriber.handleEvent).not.toHaveBeenCalled();
    });

    test('GIVEN handleEvent throws THEN error handler is called', async () => {
      const middleware = StubEventMiddlewareList.create();
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicSyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber = new MockEventSubscriber();
      const error = new Error('handleEvent failed');
      subscriber.handleEvent = vi.fn().mockRejectedValue(error);
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(errorHandler.handle).toHaveBeenCalledWith(
        error,
        subscriber,
        [meta, 'test-data'],
      );
    });

    test('GIVEN middleware throws THEN error handler is called and subscriber is NOT executed', async () => {
      const error = new Error('middleware failed');
      const middleware = StubEventMiddlewareList.create();
      vi.mocked(middleware.check).mockRejectedValue(error);
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicSyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(errorHandler.handle).toHaveBeenCalled();
      expect(subscriber.handleEvent).not.toHaveBeenCalled();
    });

    test('GIVEN multiple subscribers THEN dispatches to each in order', async () => {
      const middleware = StubEventMiddlewareList.create();
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicSyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber1 = new MockEventSubscriber();
      const subscriber2 = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch(
        [subscriber1, subscriber2],
        [meta, 'test-data'],
      );

      expect(subscriber1.handleEvent).toHaveBeenCalledWith(meta, 'test-data');
      expect(subscriber2.handleEvent).toHaveBeenCalledWith(meta, 'test-data');
    });

    test('GIVEN syncTimeout is null THEN handleEvent is called without timeout', async () => {
      const middleware = StubEventMiddlewareList.create();
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicSyncEventDispatcher({
        middleware,
        errorHandler,
        syncTimeout: null,
      });
      const subscriber = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(subscriber.handleEvent).toHaveBeenCalledWith(meta, 'test-data');
    });
  });

  describe('setSyncTimeout', () => {
    test('GIVEN a new timeout THEN getSyncTimeout returns it', () => {
      const dispatcher = BasicSyncEventDispatcher.create();

      dispatcher.setSyncTimeout(5000);

      expect(dispatcher.getSyncTimeout()).toBe(5000);
    });

    test('GIVEN a negative timeout THEN clamps to 0', () => {
      const dispatcher = BasicSyncEventDispatcher.create();

      dispatcher.setSyncTimeout(-100);

      expect(dispatcher.getSyncTimeout()).toBe(0);
    });

    test('GIVEN null timeout THEN getSyncTimeout returns null', () => {
      const dispatcher = BasicSyncEventDispatcher.create();

      dispatcher.setSyncTimeout(null);

      expect(dispatcher.getSyncTimeout()).toBeNull();
    });

    test('GIVEN setSyncTimeout returns this THEN can be chained', () => {
      const dispatcher = BasicSyncEventDispatcher.create();

      const result = dispatcher.setSyncTimeout(3000);

      expect(result).toBe(dispatcher);
    });
  });
});
