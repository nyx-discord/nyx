import { describe, expect, it, test, vi } from 'vitest';
import { BasicAsyncEventDispatcher } from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';
import { StubEventMiddlewareList } from '../../mocks/StubEventMiddlewareList';
import { StubEventErrorHandler } from '../../mocks/StubEventErrorHandler';

describe('BasicAsyncEventDispatcher', () => {
  it('SHOULD create an instance of itself', () => {
    const dispatcher = BasicAsyncEventDispatcher.create();

    expect(dispatcher).toBeInstanceOf(BasicAsyncEventDispatcher);
  });

  describe('getErrorHandler', () => {
    test('GIVEN a created dispatcher THEN has an error handler', () => {
      const dispatcher = BasicAsyncEventDispatcher.create();

      expect(dispatcher.getErrorHandler()).toBeDefined();
    });
  });

  describe('getMiddleware', () => {
    test('GIVEN a created dispatcher THEN has middleware list', () => {
      const dispatcher = BasicAsyncEventDispatcher.create();

      expect(dispatcher.getMiddleware()).toBeDefined();
      expect(dispatcher.getMiddleware().getMiddlewares().length).toBeGreaterThan(0);
    });
  });

  describe('dispatch', () => {
    test('GIVEN middleware passes THEN calls subscriber handleEvent', async () => {
      const middleware = StubEventMiddlewareList.create();
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicAsyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(subscriber.handleEvent).toHaveBeenCalledWith(meta, 'test-data');
      expect(errorHandler.handle).not.toHaveBeenCalled();
    });

    test('GIVEN handleEvent throws THEN error handler is called', async () => {
      const middleware = StubEventMiddlewareList.create();
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicAsyncEventDispatcher({
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

    test('GIVEN middleware throws THEN error handler is called and handleEvent is skipped', async () => {
      const middlewareError = new Error('middleware failed');
      const middleware = StubEventMiddlewareList.create();
      vi.mocked(middleware.check).mockRejectedValue(middlewareError);
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicAsyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(errorHandler.handle).toHaveBeenCalled();
      expect(subscriber.handleEvent).not.toHaveBeenCalled();
    });

    test('GIVEN middleware returns false THEN skips handleEvent', async () => {
      const middleware = StubEventMiddlewareList.create(false);
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicAsyncEventDispatcher({
        middleware,
        errorHandler,
      });
      const subscriber = new MockEventSubscriber();
      const meta = {};

      await dispatcher.dispatch([subscriber], [meta, 'test-data']);

      expect(subscriber.handleEvent).not.toHaveBeenCalled();
    });

    test('GIVEN multiple subscribers THEN dispatches to each', async () => {
      const middleware = StubEventMiddlewareList.create();
      const errorHandler = StubEventErrorHandler.create();
      const dispatcher = new BasicAsyncEventDispatcher({
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
  });

  describe('concurrency', () => {
    test('GIVEN a created dispatcher THEN default concurrency limit is 3', () => {
      const dispatcher = BasicAsyncEventDispatcher.create();

      expect(dispatcher.getConcurrencyLimit()).toBe(3);
    });

    test('GIVEN setConcurrencyLimit is called THEN getConcurrencyLimit returns the value', () => {
      const dispatcher = BasicAsyncEventDispatcher.create();

      dispatcher.setConcurrencyLimit(5);

      expect(dispatcher.getConcurrencyLimit()).toBe(5);
    });

    test('GIVEN setConcurrencyLimit with null THEN getConcurrencyLimit returns null', () => {
      const dispatcher = BasicAsyncEventDispatcher.create();

      dispatcher.setConcurrencyLimit(null);

      expect(dispatcher.getConcurrencyLimit()).toBeNull();
    });

    test('GIVEN create with concurrencyLimit option THEN sets it', () => {
      const dispatcher = BasicAsyncEventDispatcher.create({
        concurrencyLimit: 1,
      });

      expect(dispatcher.getConcurrencyLimit()).toBe(1);
    });

    test('GIVEN setConcurrencyLimit returns this THEN can be chained', () => {
      const dispatcher = BasicAsyncEventDispatcher.create();

      const result = dispatcher.setConcurrencyLimit(7);

      expect(result).toBe(dispatcher);
    });
  });
});
