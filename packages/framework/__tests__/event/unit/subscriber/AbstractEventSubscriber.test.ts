import { EventSubscriberLifetimeEnum, PriorityEnum } from '@nyx-discord/core';
import { describe, expect, it, test } from 'vitest';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';

describe('AbstractEventSubscriber', () => {
  it('SHOULD return the event name from getEvent', () => {
    const subscriber = new MockEventSubscriber();

    expect(subscriber.getEvent()).toBe('test');
  });

  it('SHOULD return On as the default lifetime', () => {
    const subscriber = new MockEventSubscriber();

    expect(subscriber.getLifetime()).toBe(EventSubscriberLifetimeEnum.On);
  });

  it('SHOULD return Normal as the default priority', () => {
    const subscriber = new MockEventSubscriber();

    expect(subscriber.getPriority()).toBe(PriorityEnum.Normal);
  });

  it('SHOULD ignore handled events by default', () => {
    const subscriber = new MockEventSubscriber();

    expect(subscriber.ignoresHandledEvents()).toBe(true);
  });

  it('SHOULD have no filter by default', () => {
    const subscriber = new MockEventSubscriber();

    expect(subscriber.getFilter()).toBeNull();
  });

  it('SHOULD return a symbol as its ID', () => {
    const subscriber = new MockEventSubscriber();

    expect(typeof subscriber.getId()).toBe('symbol');
  });

  it('SHOULD not be protected by default', () => {
    const subscriber = new MockEventSubscriber();

    expect(subscriber.isProtected()).toBe(false);
  });

  test('GIVEN protect is called THEN isProtected returns true', () => {
    const subscriber = new MockEventSubscriber();

    subscriber.protect();

    expect(subscriber.isProtected()).toBe(true);
  });

  test('GIVEN unprotect is called THEN isProtected returns false', () => {
    const subscriber = new MockEventSubscriber();
    subscriber.protect();

    subscriber.unprotect();

    expect(subscriber.isProtected()).toBe(false);
  });

  test('GIVEN a subscriber THEN getMeta returns a metadata object', () => {
    const subscriber = new MockEventSubscriber();

    const meta = subscriber.getMeta();
    expect(meta).toBeDefined();
    expect(typeof meta).toBe('object');
  });

  test('GIVEN handleEvent is called THEN the mock records the call', async () => {
    const subscriber = new MockEventSubscriber();
    const meta = {};

    await subscriber.handleEvent(meta, 'test-data');

    expect(subscriber.handleEvent).toHaveBeenCalledWith(meta, 'test-data');
  });

  test('GIVEN onSubscribe is called THEN does not throw', () => {
    const subscriber = new MockEventSubscriber();

    expect(() => subscriber.onSubscribe({} as any)).not.toThrow();
  });

  test('GIVEN onUnsubscribe is called THEN does not throw', () => {
    const subscriber = new MockEventSubscriber();

    expect(() => subscriber.onUnsubscribe({} as any)).not.toThrow();
  });

  test('GIVEN onBusUnregister is called THEN does not throw', () => {
    const subscriber = new MockEventSubscriber();

    expect(() => subscriber.onBusUnregister({} as any)).not.toThrow();
  });

  test('GIVEN protect returns this THEN can be chained', () => {
    const subscriber = new MockEventSubscriber();

    const result = subscriber.protect();

    expect(result).toBe(subscriber);
  });

  test('GIVEN unprotect returns this THEN can be chained', () => {
    const subscriber = new MockEventSubscriber();

    const result = subscriber.unprotect();

    expect(result).toBe(subscriber);
  });
});
