import { describe, expect, test, vi } from 'vitest';
import type {
  EventSubscriberFilter,
  AnyEventSubscriber,
  EventDispatchArgs,
} from '@nyx-discord/core';
import { SubscriberFilterCheckMiddleware } from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';

describe('SubscriberFilterCheckMiddleware', () => {
  test('GIVEN a subscriber with no filter THEN returns true', async () => {
    const middleware = new SubscriberFilterCheckMiddleware();
    const subscriber = new MockEventSubscriber();
    const meta = {};

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
    expect(result.checkNext).toBe(true);
  });

  test('GIVEN a subscriber with a passing filter THEN returns true', async () => {
    const middleware = new SubscriberFilterCheckMiddleware();
    const filter: EventSubscriberFilter<any, any> = {
      check: vi.fn().mockResolvedValue(true),
    };
    const subscriber = new MockEventSubscriber();
    (subscriber as any).filter = filter;
    const meta = {};

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(true);
    expect(filter.check).toHaveBeenCalledWith(subscriber, meta);
  });

  test('GIVEN a subscriber with a failing filter THEN returns false', async () => {
    const middleware = new SubscriberFilterCheckMiddleware();
    const filter: EventSubscriberFilter<any, any> = {
      check: vi.fn().mockResolvedValue(false),
    };
    const subscriber = new MockEventSubscriber();
    (subscriber as any).filter = filter;
    const meta = {};

    const result = await middleware.check(subscriber, meta);

    expect(result.allowed).toBe(false);
    expect(result.checkNext).toBe(false);
    expect(filter.check).toHaveBeenCalledWith(subscriber, meta);
  });

  test('GIVEN a new instance THEN is protected', () => {
    const middleware = new SubscriberFilterCheckMiddleware();

    expect(middleware.isProtected()).toBe(true);
  });
});
