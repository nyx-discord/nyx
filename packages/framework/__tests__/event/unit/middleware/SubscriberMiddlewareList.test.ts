import { TypedFields } from '@nyx-discord/core';
import { describe, expect, it, test } from 'vitest';
import {
  HandleCheckEventMiddleware,
  LifetimeCheckEventMiddleware,
  SubscriberFilterCheckMiddleware,
  SubscriberMiddlewareList,
} from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';
import { StubEventMiddleware } from '../../mocks/StubEventMiddleware';

describe('SubscriberMiddlewareList', () => {
  it('SHOULD create an instance of itself', () => {
    const list = SubscriberMiddlewareList.create();

    expect(list).toBeInstanceOf(SubscriberMiddlewareList);
  });

  test('GIVEN a created list THEN contains 3 middleware', () => {
    const list = SubscriberMiddlewareList.create();
    const middlewares = list.getMiddlewares();

    expect(middlewares).toHaveLength(3);
  });

  test('GIVEN a created list THEN middleware are in priority order (HandleCheck, FilterCheck, Lifetime)', () => {
    const list = SubscriberMiddlewareList.create();
    const middlewares = list.getMiddlewares();

    expect(middlewares[0]).toBeInstanceOf(HandleCheckEventMiddleware);
    expect(middlewares[1]).toBeInstanceOf(SubscriberFilterCheckMiddleware);
    expect(middlewares[2]).toBeInstanceOf(LifetimeCheckEventMiddleware);
  });

  test('GIVEN a created list THEN middleware priorities are in descending order', () => {
    const list = SubscriberMiddlewareList.create();
    const middlewares = list.getMiddlewares();

    const priorities = middlewares.map((m) => m.getPriority());
    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i - 1]).toBeGreaterThanOrEqual(priorities[i]);
    }
  });

  test('GIVEN all middleware pass THEN check returns true', async () => {
    const list = SubscriberMiddlewareList.create();
    const subscriber = new MockEventSubscriber();
    const meta = {};

    const result = await list.check(subscriber, meta);

    expect(result).toBe(true);
  });

  test('GIVEN a middleware returns false THEN check returns false', async () => {
    const subscriber = new MockEventSubscriber();
    const meta = {};
    TypedFields.EventHandled.set(meta, true);

    const list = SubscriberMiddlewareList.create();
    const result = await list.check(subscriber, meta);

    expect(result).toBe(false);
  });

  test('GIVEN add is called THEN middleware is appended', () => {
    const list = SubscriberMiddlewareList.create();
    const extraMiddleware = StubEventMiddleware.create();

    list.add(extraMiddleware);

    expect(list.getMiddlewares()).toHaveLength(4);
  });

  test('GIVEN remove is called on an existing middleware THEN returns true', () => {
    const list = SubscriberMiddlewareList.create();
    const middleware = list.getMiddlewares()[0];

    const result = list.remove(middleware);

    expect(result).toBe(true);
    expect(list.getMiddlewares()).toHaveLength(2);
  });

  test('GIVEN remove is called on a non-existing middleware THEN returns false', () => {
    const list = SubscriberMiddlewareList.create();
    const notInList = StubEventMiddleware.create();

    const result = list.remove(notInList);

    expect(result).toBe(false);
    expect(list.getMiddlewares()).toHaveLength(3);
  });

  test('GIVEN clear is called THEN list is empty', () => {
    const list = SubscriberMiddlewareList.create();

    list.clear();

    expect(list.getMiddlewares()).toHaveLength(0);
  });
});
