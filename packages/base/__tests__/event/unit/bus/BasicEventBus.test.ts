import {
  type AnyEventSubscriberFrom,
  type Comparator,
  type EventDispatcher,
  type Identifier,
  IllegalDuplicateError,
  IllegalStateError,
  type MetadataFactory,
  ObjectNotFoundError,
  PriorityEnum,
} from '@nyx-discord/types';
import { describe, expect, it, test, vi } from 'vitest';
import { BasicEventBus } from '../../../../src';
import { MockEventSubscriber } from '../../mocks/MockEventSubscriber';
import { StubEventDispatcher } from '../../mocks/StubEventDispatcher';
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
    id: Identifier;
    sorter: Comparator<Identifier, AnyEventSubscriberFrom<TestEvents>>;
    dispatcher: EventDispatcher;
    metaFactory: MetadataFactory;
  }>,
): BasicEventBus<TestEvents> =>
  new BasicEventBus<TestEvents>(
    overrides?.sorter ?? createSorter(),
    overrides?.dispatcher ?? StubEventDispatcher.create(),
    overrides?.metaFactory ?? StubEventMetadata.create(),
  );

describe('BasicEventBus', () => {
  describe('static factories', () => {
    it('SHOULD create a sync instance of itself', () => {
      const bus = BasicEventBus.createSync<TestEvents>();

      expect(bus).toBeInstanceOf(BasicEventBus);
    });

    it('SHOULD create an async instance of itself', () => {
      const bus = BasicEventBus.createAsync<TestEvents>();

      expect(bus).toBeInstanceOf(BasicEventBus);
    });
  });

  describe('getMeta', () => {
    test('GIVEN a new bus THEN getMeta returns a metadata object', () => {
      const bus = createBus();
      const meta = bus.getMeta();

      expect(meta).toBeDefined();
      expect(typeof meta).toBe('object');
    });
  });

  describe('getDispatcher / setDispatcher', () => {
    test('GIVEN a bus THEN getDispatcher returns the dispatcher', () => {
      const dispatcher = StubEventDispatcher.create();
      const bus = createBus({ dispatcher });

      expect(bus.getDispatcher()).toBe(dispatcher);
    });

    test('GIVEN setDispatcher is called THEN getDispatcher returns the new one', () => {
      const bus = createBus();
      const newDispatcher = StubEventDispatcher.create();

      bus.setDispatcher(newDispatcher);

      expect(bus.getDispatcher()).toBe(newDispatcher);
    });
  });

  describe('getMetadataFactory', () => {
    test('GIVEN a constructor metaFactory THEN getMetadataFactory returns it', () => {
      const metaFactory = StubEventMetadata.create();
      const bus = createBus({ metaFactory });

      expect(bus.getMetadataFactory()).toBe(metaFactory);
    });
  });

  describe('protect / unprotect / isProtected', () => {
    test('GIVEN a new bus THEN is not protected', () => {
      const bus = createBus();

      expect(bus.isProtected()).toBe(false);
    });

    test('GIVEN protect is called THEN isProtected returns true', () => {
      const bus = createBus();

      bus.protect();

      expect(bus.isProtected()).toBe(true);
    });

    test('GIVEN unprotect is called THEN isProtected returns false', () => {
      const bus = createBus();
      bus.protect();

      bus.unprotect();

      expect(bus.isProtected()).toBe(false);
    });
  });

  describe('subscribe', () => {
    test('GIVEN a subscriber THEN adds it to the bus', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();

      await bus.subscribe(subscriber);

      expect(bus.isSubscribed(subscriber)).toBe(true);
      expect(
        bus.getSubscribedEvents().get('test')?.has(subscriber.getId()),
      ).toBe(true);
    });

    test('GIVEN a duplicate subscriber ID THEN throws IllegalDuplicateError', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();

      await bus.subscribe(subscriber);

      await expect(bus.subscribe(subscriber)).rejects.toThrow(
        IllegalDuplicateError,
      );
    });

    test('GIVEN multiple subscribers with different IDs THEN all are added', async () => {
      const bus = createBus();
      const subscriber1 = new MockEventSubscriber();
      const subscriber2 = new MockEventSubscriber();

      await bus.subscribe(subscriber1, subscriber2);

      expect(bus.isSubscribed(subscriber1)).toBe(true);
      expect(bus.isSubscribed(subscriber2)).toBe(true);
    });
  });

  describe('isSubscribed', () => {
    test('GIVEN a non-subscribed subscriber THEN returns false', () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();

      expect(bus.isSubscribed(subscriber)).toBe(false);
    });

    test('GIVEN a subscribed subscriber THEN returns true', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      expect(bus.isSubscribed(subscriber)).toBe(true);
    });
  });

  describe('unsubscribe', () => {
    test('GIVEN a subscribed subscriber THEN removes it', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      await bus.unsubscribe(subscriber);

      expect(bus.isSubscribed(subscriber)).toBe(false);
    });

    test('GIVEN a non-subscribed subscriber THEN throws ObjectNotFoundError', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();

      await expect(bus.unsubscribe(subscriber)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });

    test('GIVEN a protected subscriber THEN unsubscribe throws IllegalStateError', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      subscriber.protect();
      await bus.subscribe(subscriber);

      await expect(bus.unsubscribe(subscriber)).rejects.toThrow(
        IllegalStateError,
      );
    });

    test('GIVEN a protected subscriber THEN unsubscribeProtected succeeds', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      subscriber.protect();
      await bus.subscribe(subscriber);

      await bus.unsubscribeProtected(subscriber);

      expect(bus.isSubscribed(subscriber)).toBe(false);
    });
  });

  describe('emit', () => {
    test('GIVEN subscribers for the event THEN dispatches to them', async () => {
      const dispatcher = StubEventDispatcher.create();
      const bus = createBus({ dispatcher });
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      await bus.emit('test', ['hello'] as any);

      expect(dispatcher.dispatch).toHaveBeenCalled();
      const dispatchedSubscribers = vi.mocked(dispatcher.dispatch).mock
        .calls[0]![0];
      expect(dispatchedSubscribers).toHaveLength(1);
      expect(dispatchedSubscribers[0]).toBe(subscriber);
    });

    test('GIVEN no subscribers for the event THEN does not dispatch', async () => {
      const dispatcher = StubEventDispatcher.create();
      const bus = createBus({ dispatcher });

      await bus.emit('test', ['hello'] as any);

      expect(dispatcher.dispatch).not.toHaveBeenCalled();
    });

    test('GIVEN subscribers for a different event THEN does not dispatch to them', async () => {
      const dispatcher = StubEventDispatcher.create();
      const bus = createBus({ dispatcher });
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      await bus.emit('other', [42] as any);

      expect(dispatcher.dispatch).not.toHaveBeenCalled();
    });

    test('GIVEN emit THEN returns this for chaining', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      const result = await bus.emit('test', ['hello'] as any);

      expect(result).toBe(bus);
    });

    test('GIVEN emit THEN dispatch args include metadata and event args', async () => {
      const dispatcher = StubEventDispatcher.create();
      const metaFactory = StubEventMetadata.create();
      const bus = createBus({ dispatcher, metaFactory });
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      await bus.emit('test', ['hello'] as any);

      const dispatchedArgs = vi.mocked(dispatcher.dispatch).mock.calls[0]![1];
      expect(dispatchedArgs).toHaveLength(2); // [meta, 'hello']
      expect(metaFactory.createOrPopulate).toHaveBeenCalled();
      expect(dispatchedArgs[1]).toBe('hello');
    });
  });

  describe('clearSubscribers', () => {
    test('GIVEN subscribers THEN removes all', async () => {
      const bus = createBus();
      const subscriber1 = new MockEventSubscriber();
      const subscriber2 = new MockEventSubscriber();
      await bus.subscribe(subscriber1, subscriber2);

      await bus.clearSubscribers();

      expect(bus.isSubscribed(subscriber1)).toBe(false);
      expect(bus.isSubscribed(subscriber2)).toBe(false);
    });

    test('GIVEN an event name THEN removes only subscribers for that event', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      await bus.clearSubscribers('other');

      expect(bus.isSubscribed(subscriber)).toBe(true);
    });

    test('GIVEN a protected subscriber AND clearProtected=false THEN does not clear it', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      subscriber.protect();
      await bus.subscribe(subscriber);

      await bus.clearSubscribers(undefined, false);

      expect(bus.isSubscribed(subscriber)).toBe(true);
    });

    test('GIVEN a protected subscriber AND clearProtected=true THEN clears it', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      subscriber.protect();
      await bus.subscribe(subscriber);

      await bus.clearSubscribers(undefined, true);

      expect(bus.isSubscribed(subscriber)).toBe(false);
    });
  });

  describe('getSubscribedEvents', () => {
    test('GIVEN subscribers THEN returns the event collection', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      const events = bus.getSubscribedEvents();

      expect(events.has('test')).toBe(true);
      expect(events.get('test')?.has(subscriber.getId())).toBe(true);
    });
  });

  describe('getSubscribers', () => {
    test('GIVEN subscribers THEN returns a flattened collection', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      const allSubscribers = bus.getSubscribers();

      expect(allSubscribers.has(subscriber.getId())).toBe(true);
    });
  });

  describe('sortSubscribers', () => {
    test('GIVEN subscribers THEN re-sorts existing event collections with custom comparator', async () => {
      const bus = createBus();
      const subLow = MockEventSubscriber.create({ priority: PriorityEnum.Low });
      const subHigh = MockEventSubscriber.create({ priority: PriorityEnum.High });

      await bus.subscribe(subLow, subHigh);

      const eventSubsBefore = bus.getSubscribedEvents().get('test');
      expect(Array.from(eventSubsBefore!.values())).toEqual([subLow, subHigh]);

      bus.sortSubscribers((a, b) => b.getPriority() - a.getPriority());

      const eventSubsAfter = bus.getSubscribedEvents().get('test');
      expect(Array.from(eventSubsAfter!.values())).toEqual([subHigh, subLow]);
    });
  });

  describe('iterators', () => {
    test('GIVEN subscribers THEN values yields them', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      const yielded = Array.from(bus.values());

      expect(yielded).toContain(subscriber);
    });

    test('GIVEN subscribers THEN entries yields [id, subscriber] pairs', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      const entries = Array.from(bus.entries());

      expect(entries).toHaveLength(1);
      expect(entries[0]![0]).toBe(subscriber.getId());
      expect(entries[0]![1]).toBe(subscriber);
    });

    test('GIVEN subscribers THEN keys yields IDs', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      const keys = Array.from(bus.keys());

      expect(keys).toContain(subscriber.getId());
    });

    test('GIVEN subscribers THEN iterator yields [id, subscriber] pairs', async () => {
      const bus = createBus();
      const subscriber = new MockEventSubscriber();
      await bus.subscribe(subscriber);

      const iterated = Array.from(bus);

      expect(iterated).toHaveLength(1);
      expect(iterated[0]![1]).toBe(subscriber);
    });
  });
});
