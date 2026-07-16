import { EventSubscriberLifetimeEnum, PriorityEnum } from '@nyx-discord/core';
import type { ClientEvents } from 'discord.js';
import { describe, expect, it, test } from 'vitest';
import { MockDJSClientSubscriber } from '../../mocks/MockDJSClientSubscriber';

describe('AbstractDJSClientSubscriber', () => {
  it('SHOULD create an instance for a ClientEvents key', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(subscriber).toBeInstanceOf(MockDJSClientSubscriber);
  });

  test('GIVEN a messageCreate subscriber THEN getEvent returns messageCreate', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(subscriber.getEvent()).toBe('messageCreate');
  });

  test('GIVEN a guildCreate subscriber THEN getEvent returns guildCreate', () => {
    const subscriber = new MockDJSClientSubscriber('guildCreate');

    expect(subscriber.getEvent()).toBe('guildCreate');
  });

  it('SHOULD have default priority Normal', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(subscriber.getPriority()).toBe(PriorityEnum.Normal);
  });

  it('SHOULD have default lifetime On', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(subscriber.getLifetime()).toBe(EventSubscriberLifetimeEnum.On);
  });

  it('SHOULD ignore handled events by default', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(subscriber.ignoresHandledEvents()).toBe(true);
  });

  it('SHOULD not be protected by default', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(subscriber.isProtected()).toBe(false);
  });

  it('SHOULD have no filter by default', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(subscriber.getFilter()).toBeNull();
  });

  test('GIVEN handleEvent is called THEN the mock records the call', async () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');
    const meta = {};
    const mockMessage = {} as ClientEvents['messageCreate'][0];

    await subscriber.handleEvent(meta, mockMessage);

    expect(subscriber.handleEvent).toHaveBeenCalledWith(meta, mockMessage);
  });

  test('GIVEN protect is called THEN isProtected returns true', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    subscriber.protect();

    expect(subscriber.isProtected()).toBe(true);
  });

  test('GIVEN unprotect is called THEN isProtected returns false', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');
    subscriber.protect();

    subscriber.unprotect();

    expect(subscriber.isProtected()).toBe(false);
  });

  test('GIVEN a subscriber THEN getMeta returns a metadata object', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    const meta = subscriber.getMeta();
    expect(meta).toBeDefined();
    expect(typeof meta).toBe('object');
  });

  test('GIVEN onSubscribe is called THEN does not throw', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(() => subscriber.onSubscribe({} as any)).not.toThrow();
  });

  test('GIVEN onUnsubscribe is called THEN does not throw', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(() => subscriber.onUnsubscribe({} as any)).not.toThrow();
  });

  test('GIVEN onBusUnregister is called THEN does not throw', () => {
    const subscriber = new MockDJSClientSubscriber('messageCreate');

    expect(() => subscriber.onBusUnregister({} as any)).not.toThrow();
  });
});
