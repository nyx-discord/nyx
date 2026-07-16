import type { EventBus, EventManagerEventsArgs } from '@nyx-discord/core';
import {
  IllegalDuplicateError,
  ObjectNotFoundError,
  ProtectedObjectError,
} from '@nyx-discord/core';
import type { ClientEvents } from 'discord.js';
import { describe, expect, test, vi } from 'vitest';
import { BasicEventBus, DefaultEventManager } from '../../../../src';
import { StubEventBus } from '../../mocks/StubEventBus';
import { StubEventSubscriber } from '../../mocks/StubEventSubscriber';

const createMockClientBus = (): EventBus<ClientEvents> =>
  StubEventBus.create(
    Symbol('client-bus'),
  ) as unknown as EventBus<ClientEvents>;

const createMockManagerBus = (): EventBus<EventManagerEventsArgs> =>
  StubEventBus.create(
    Symbol('manager-bus'),
  ) as unknown as EventBus<EventManagerEventsArgs>;

describe('DefaultEventManager', () => {
  describe('constructor', () => {
    test('GIVEN managerBus and clientBus THEN protects both', () => {
      const managerBus = createMockManagerBus();
      const clientBus = createMockClientBus();

      new DefaultEventManager({ managerBus, clientBus });

      expect(managerBus.isProtected()).toBe(true);
      expect(clientBus.isProtected()).toBe(true);
    });

    test('GIVEN managerBus and clientBus THEN getManagerBus and getClientBus return them', () => {
      const managerBus = createMockManagerBus();
      const clientBus = createMockClientBus();
      const manager = new DefaultEventManager({ managerBus, clientBus });

      expect(manager.getManagerBus()).toBe(managerBus);
      expect(manager.getClientBus()).toBe(clientBus);
    });

    test('GIVEN a new manager THEN getBuses returns empty collection', () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });

      expect(manager.getBuses().size).toBe(0);
    });
  });

  describe('addEventBuses', () => {
    test('GIVEN a new bus THEN adds it to the collection', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const newBus = StubEventBus.create(Symbol('new-bus'));

      await manager.addEventBuses(newBus);

      expect(manager.isBusRegistered(newBus)).toBe(true);
    });

    test('GIVEN a bus with duplicate id THEN throws IllegalDuplicateError', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const busId = Symbol('duplicate-bus');
      const bus1 = StubEventBus.create(busId);
      const bus2 = StubEventBus.create(busId);

      await manager.addEventBuses(bus1);

      await expect(manager.addEventBuses(bus2)).rejects.toThrow(
        IllegalDuplicateError,
      );
    });

    test('GIVEN multiple buses THEN all are added', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const bus1 = StubEventBus.create(Symbol('bus-1'));
      const bus2 = StubEventBus.create(Symbol('bus-2'));

      await manager.addEventBuses(bus1, bus2);

      expect(manager.isBusRegistered(bus1)).toBe(true);
      expect(manager.isBusRegistered(bus2)).toBe(true);
    });
  });

  describe('removeEventBus', () => {
    test('GIVEN a registered bus THEN removes it', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const bus = StubEventBus.create(Symbol('bus'));
      await manager.addEventBuses(bus);

      await manager.removeEventBus(bus);

      expect(manager.isBusRegistered(bus)).toBe(false);
    });

    test('GIVEN a registered bus by id THEN removes it', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const busId = Symbol('bus-id');
      const bus = StubEventBus.create(busId);
      await manager.addEventBuses(bus);

      await manager.removeEventBus(busId);

      expect(manager.isBusRegistered(bus)).toBe(false);
    });

    test('GIVEN a non-registered bus THEN throws ObjectNotFoundError', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const bus = StubEventBus.create(Symbol('unknown'));

      await expect(manager.removeEventBus(bus)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });

    test('GIVEN a protected bus THEN throws ProtectedObjectError', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const protectedBus = StubEventBus.create(Symbol('protected'), true);
      await manager.addEventBuses(protectedBus);

      await expect(manager.removeEventBus(protectedBus)).rejects.toThrow(
        ProtectedObjectError,
      );
    });
  });

  describe('getBus', () => {
    test('GIVEN a registered bus THEN returns it', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const bus = StubEventBus.create(Symbol('bus'));
      await manager.addEventBuses(bus);

      const result = manager.getBus(bus);

      expect(result).toBe(bus);
    });

    test('GIVEN a non-registered bus THEN returns null', () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const bus = StubEventBus.create(Symbol('unknown'));

      const result = manager.getBus(bus);

      expect(result).toBeNull();
    });
  });

  describe('isBusRegistered', () => {
    test('GIVEN a registered bus THEN returns true', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const bus = StubEventBus.create(Symbol('bus'));
      await manager.addEventBuses(bus);

      expect(manager.isBusRegistered(bus)).toBe(true);
    });

    test('GIVEN a non-registered bus THEN returns false', () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const bus = StubEventBus.create(Symbol('unknown'));

      expect(manager.isBusRegistered(bus)).toBe(false);
    });

    test('GIVEN a registered bus by id THEN returns true', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const busId = Symbol('bus-id');
      const bus = StubEventBus.create(busId);
      await manager.addEventBuses(bus);

      expect(manager.isBusRegistered(busId)).toBe(true);
    });
  });

  describe('getBusByClass', () => {
    test('GIVEN a non-registered class THEN returns null', () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });

      const result = manager.getBusByClass(BasicEventBus);

      expect(result).toBeNull();
    });

    test('GIVEN a registered BasicEventBus THEN getBusByClass finds it', async () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });
      const syncBus = BasicEventBus.createSync(Symbol('sync-bus'));
      await manager.addEventBuses(syncBus);

      const result = manager.getBusByClass(BasicEventBus);

      expect(result).toBe(syncBus);
    });
  });

  describe('subscribeClient', () => {
    test('GIVEN subscribers THEN delegates to clientBus', async () => {
      const clientBus = createMockClientBus();
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus,
      });
      const subscriber = StubEventSubscriber.create({
        getEvent: vi.fn().mockReturnValue('messageCreate'),
      });

      await manager.subscribeClient(subscriber as never);

      expect(clientBus.subscribe).toHaveBeenCalledWith(subscriber);
    });
  });

  describe('subscribeManager', () => {
    test('GIVEN subscribers THEN delegates to managerBus', async () => {
      const managerBus = createMockManagerBus();
      const manager = new DefaultEventManager({
        managerBus,
        clientBus: createMockClientBus(),
      });
      const subscriber = StubEventSubscriber.create();

      await manager.subscribeManager(subscriber as never);

      expect(managerBus.subscribe).toHaveBeenCalledWith(subscriber);
    });
  });

  describe('onStart / onStop', () => {
    test('GIVEN onStart THEN does not throw', () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });

      expect(() => manager.onStart()).not.toThrow();
    });

    test('GIVEN onStop THEN clears buses', () => {
      const manager = new DefaultEventManager({
        managerBus: createMockManagerBus(),
        clientBus: createMockClientBus(),
      });

      expect(() => manager.onStop()).not.toThrow();
    });
  });
});
