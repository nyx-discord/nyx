import type { ErrorConsumer } from '@nyx-discord/core';
import { describe, expect, test, vi } from 'vitest';
import { BasicErrorHandler } from '../../src';
import { StubErrorHandler } from './mocks/StubErrorHandler';

class TestError extends Error {}
class ChildError extends TestError {}

type Obj = object;
type Args = unknown[];
type Consumer = ErrorConsumer<Obj, Obj, Args>;

describe('BasicErrorHandler', () => {
  describe('static factories', () => {
    test('GIVEN create THEN returns an ErrorHandler', () => {
      const handler = BasicErrorHandler.create();

      expect(handler).toBeInstanceOf(BasicErrorHandler);
    });

    test('GIVEN createWithFallbackLogger THEN sets a logger-based fallback', async () => {
      const loggerFn = vi.fn();
      const handler = BasicErrorHandler.createWithFallbackLogger<Obj, Args>(
        () => ({ error: loggerFn }) as never,
      );

      await handler.handle(new Error('test'), {} as Obj, [] as unknown as Args);

      expect(loggerFn).toHaveBeenCalledWith(new Error('test'), {} as Obj, []);
    });

    test('GIVEN DefaultFallbackLogger THEN logs to console.error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      BasicErrorHandler.DefaultFallbackLogger(new Error('test'), {} as Obj, [] as unknown as Args);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('handle', () => {
    test('GIVEN a registered consumer for the error type THEN uses it', async () => {
      const consumer = vi.fn<Consumer>();
      const handler = StubErrorHandler.create();
      handler.setConsumer(TestError, consumer);

      const error = new TestError();
      await handler.handle(error, {} as Obj, [] as unknown as Args);

      expect(consumer).toHaveBeenCalledWith(error, {} as Obj, []);
    });

    test('GIVEN no registered consumer THEN uses fallback', async () => {
      const fallback = vi.fn<Consumer>();
      const handler = StubErrorHandler.create(fallback);

      const error = new Error('test');
      await handler.handle(error, {} as Obj, [] as unknown as Args);

      expect(fallback).toHaveBeenCalledWith(error, {} as Obj, []);
    });

    test('GIVEN a child error with parent consumer registered THEN uses parent consumer', async () => {
      const parentConsumer = vi.fn<Consumer>();
      const handler = StubErrorHandler.create();
      handler.setConsumer(TestError, parentConsumer);

      const error = new ChildError();
      await handler.handle(error, {} as Obj, [] as unknown as Args);

      expect(parentConsumer).toHaveBeenCalledWith(error, {} as Obj, []);
    });

    test('GIVEN a child error with exact consumer THEN uses exact match over parent', async () => {
      const exactConsumer = vi.fn<Consumer>();
      const parentConsumer = vi.fn<Consumer>();
      const handler = StubErrorHandler.create();
      handler.setConsumer(TestError, parentConsumer);
      handler.setConsumer(ChildError, exactConsumer);

      const error = new ChildError();
      await handler.handle(error, {} as Obj, [] as unknown as Args);

      expect(exactConsumer).toHaveBeenCalledOnce();
      expect(parentConsumer).not.toHaveBeenCalled();
    });
  });

  describe('consumer CRUD', () => {
    test('GIVEN setConsumer THEN consumer is registered', () => {
      const handler = StubErrorHandler.create();
      handler.setConsumer(TestError, vi.fn<Consumer>());
      expect(handler.getConsumers().size).toBe(1);
    });

    test('GIVEN removeConsumerOf THEN consumer is removed', () => {
      const handler = StubErrorHandler.create();
      handler.setConsumer(TestError, vi.fn<Consumer>());
      handler.removeConsumerOf(TestError);
      expect(handler.getConsumers().size).toBe(0);
    });

    test('GIVEN clear THEN all consumers are removed', () => {
      const handler = StubErrorHandler.create();
      handler.setConsumer(TestError, vi.fn<Consumer>());
      handler.setConsumer(ChildError, vi.fn<Consumer>());
      handler.clear();
      expect(handler.getConsumers().size).toBe(0);
    });

    test('GIVEN getConsumers THEN returns the collection', () => {
      const handler = StubErrorHandler.create();
      handler.setConsumer(TestError, vi.fn<Consumer>());
      expect(handler.getConsumers().size).toBe(1);
    });
  });

  describe('fallback consumer', () => {
    test('GIVEN setFallbackConsumer THEN getFallbackConsumer returns it', () => {
      const handler = StubErrorHandler.create();
      const newFallback = vi.fn<Consumer>();
      handler.setFallbackConsumer(newFallback);
      expect(handler.getFallbackConsumer()).toBe(newFallback);
    });

    test('GIVEN constructor fallbackConsumer THEN getFallbackConsumer returns it', () => {
      const fallback = vi.fn<Consumer>();
      const handler = StubErrorHandler.create(fallback);
      expect(handler.getFallbackConsumer()).toBe(fallback);
    });
  });

  describe('constructor with null consumers', () => {
    test('GIVEN null consumers THEN defaults to empty collection', () => {
      const fallback = vi.fn<Consumer>();
      const handler = StubErrorHandler.createNull(fallback);
      expect(handler.getConsumers().size).toBe(0);
      expect(handler.getFallbackConsumer()).toBe(fallback);
    });
  });
});
