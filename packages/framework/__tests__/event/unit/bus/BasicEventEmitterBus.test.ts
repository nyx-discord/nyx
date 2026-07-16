import {
  type AnyEventSubscriberFrom,
  type Comparator,
  type Identifier,
} from '@nyx-discord/core';
import { describe, expect, it, test } from 'vitest';
import { BasicEventEmitterBus } from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';
import { StubEventDispatcher } from '../../mocks/StubEventDispatcher';
import { StubEventEmitter } from '../../mocks/StubEventEmitter';
import { StubEventMetadata } from '../../mocks/StubEventMetadata';

type TestEvents = {
  test: [data: string];
  other: [value: number];
};

const createSorter =
  (): Comparator<Identifier, AnyEventSubscriberFrom<TestEvents>> => (a, b) =>
    a.getPriority() - b.getPriority();

const createBus = (
  overrides?: Partial<{
    emitter: ReturnType<typeof StubEventEmitter.create>;
  }>,
): BasicEventEmitterBus<
  TestEvents,
  ReturnType<typeof StubEventEmitter.create>
> =>
  new BasicEventEmitterBus<
    TestEvents,
    ReturnType<typeof StubEventEmitter.create>
  >(
    overrides?.emitter ?? StubEventEmitter.create(),
    createSorter(),
    StubEventDispatcher.create(),
    StubEventMetadata.create(),
  );

describe('BasicEventEmitterBus', () => {
  describe('static factories', () => {
    it('SHOULD create a sync instance', () => {
      const emitter = StubEventEmitter.create();
      const bus = BasicEventEmitterBus.createSyncWithEmitter<
        TestEvents,
        typeof emitter
      >(emitter as any);

      expect(bus).toBeInstanceOf(BasicEventEmitterBus);
    });

    it('SHOULD create an async instance', () => {
      const emitter = StubEventEmitter.create();
      const bus = BasicEventEmitterBus.createAsyncWithEmitter<
        TestEvents,
        typeof emitter
      >(emitter as any);

      expect(bus).toBeInstanceOf(BasicEventEmitterBus);
    });
  });

  describe('getEmitter', () => {
    test('GIVEN a constructor emitter THEN getEmitter returns it', () => {
      const emitter = StubEventEmitter.create();
      const bus = createBus({ emitter });

      expect(bus.getEmitter()).toBe(emitter);
    });
  });

  describe('subscribe', () => {
    test('GIVEN a subscriber THEN listens to emitter for its event', async () => {
      const emitter = StubEventEmitter.create();
      const bus = createBus({ emitter });
      const subscriber = new MockEventSubscriber();

      await bus.subscribe(subscriber);

      expect(emitter.on).toHaveBeenCalledWith('test', expect.any(Function));
    });

    test('GIVEN add to bus THEN isSubscribed returns true', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();

      await bus.subscribe(subscriber);

      expect(bus.isSubscribed(subscriber)).toBe(true);
    });
  });

  describe('unsubscribe', () => {
    test('GIVEN a subscribed subscriber THEN removes it from the bus', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      await bus.unsubscribe(subscriber);

      expect(bus.isSubscribed(subscriber)).toBe(false);
    });
  });

  describe('clearSubscribers', () => {
    test('GIVEN subscribers THEN clears the bus', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      await bus.clearSubscribers();

      expect(bus.isSubscribed(subscriber)).toBe(false);
    });
  });
});
