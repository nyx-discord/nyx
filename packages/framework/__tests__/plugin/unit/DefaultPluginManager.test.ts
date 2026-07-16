import {
  IllegalDuplicateError,
  ObjectNotFoundError,
  PluginEventEnum,
} from '@nyx-discord/core';
import { describe, expect, test } from 'vitest';
import { DefaultPluginManager } from '../../../src';
import { StubEventBus } from '../../event/mocks/StubEventBus';
import { StubEventSubscriber } from '../../event/mocks/StubEventSubscriber';
import { StubBot } from '../mocks/StubBot';
import { StubPlugin } from '../mocks/StubPlugin';

const createManager = (
  bot = StubBot.create(),
  bus = StubEventBus.create(Symbol('plugin-bus')),
) => new DefaultPluginManager({ bot: bot as never, bus: bus as never });

describe('DefaultPluginManager', () => {
  describe('register', () => {
    test('GIVEN a plugin THEN adds it and emits event', async () => {
      const bot = StubBot.create();
      const bus = StubEventBus.create(Symbol('plugin-bus'));
      const manager = createManager(bot, bus);
      const plugin = new StubPlugin();

      await manager.register(plugin);

      expect(manager.getPluginById(plugin.getId())).toBe(plugin);
      expect(plugin.onRegister).toHaveBeenCalledWith(bot);
      expect(bus.emit).toHaveBeenCalledWith(PluginEventEnum.PluginAdd, [
        plugin,
      ]);
    });

    test('GIVEN a duplicate plugin THEN throws IllegalDuplicateError', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();

      await manager.register(plugin);

      await expect(manager.register(plugin)).rejects.toThrow(
        IllegalDuplicateError,
      );
    });
  });

  describe('unregister', () => {
    test('GIVEN a registered plugin THEN removes it and emits event', async () => {
      const bot = StubBot.create();
      const bus = StubEventBus.create(Symbol('plugin-bus'));
      const manager = createManager(bot, bus);
      const plugin = new StubPlugin();
      await manager.register(plugin);

      await manager.unregister(plugin);

      expect(manager.getPluginById(plugin.getId())).toBeNull();
      expect(plugin.onUnregister).toHaveBeenCalledWith(bot);
      expect(bus.emit).toHaveBeenCalledWith(PluginEventEnum.PluginRemove, [
        plugin,
      ]);
    });

    test('GIVEN a plugin ID THEN unregisters by ID', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();
      const id = plugin.getId();
      await manager.register(plugin);

      await manager.unregister(id);

      expect(manager.getPluginById(id)).toBeNull();
    });

    test('GIVEN an unregistered plugin THEN throws ObjectNotFoundError', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();

      await expect(manager.unregister(plugin)).rejects.toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('subscribe', () => {
    test('GIVEN subscribers THEN delegates to eventBus', async () => {
      const bus = StubEventBus.create(Symbol('plugin-bus'));
      const manager = createManager(StubBot.create(), bus);

      await manager.subscribe(StubEventSubscriber.create() as never);

      expect(bus.subscribe).toHaveBeenCalled();
    });
  });

  describe('getPluginById', () => {
    test('GIVEN a registered plugin THEN returns it', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();
      await manager.register(plugin);

      expect(manager.getPluginById(plugin.getId())).toBe(plugin);
    });

    test('GIVEN an unknown ID THEN returns null', () => {
      const manager = createManager();
      expect(manager.getPluginById(Symbol('unknown'))).toBeNull();
    });
  });

  describe('getPluginByClass', () => {
    test('GIVEN a plugin of the class THEN finds it', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();
      await manager.register(plugin);

      const found = manager.getPluginByClass(StubPlugin);

      expect(found).toBe(plugin);
    });

    test('GIVEN no matching plugin THEN returns null', () => {
      const manager = createManager();
      expect(manager.getPluginByClass(StubPlugin)).toBeNull();
    });

    test('GIVEN force is true and no match THEN throws', () => {
      const manager = createManager();
      expect(() => manager.getPluginByClass(StubPlugin, true)).toThrow(
        ObjectNotFoundError,
      );
    });
  });

  describe('getPlugins', () => {
    test('GIVEN registered plugins THEN returns the collection', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();
      await manager.register(plugin);

      const plugins = manager.getPlugins();

      expect(plugins.size).toBe(1);
      expect(plugins.has(plugin.getId())).toBe(true);
    });
  });

  describe('getEventBus', () => {
    test('GIVEN a manager THEN returns the bus', () => {
      const bus = StubEventBus.create(Symbol('plugin-bus'));
      const manager = createManager(StubBot.create(), bus);

      expect(manager.getEventBus()).toBe(bus);
    });
  });

  describe('iterators', () => {
    test('GIVEN plugins THEN values yields them', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();
      await manager.register(plugin);

      const result = Array.from(manager.values());

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(plugin);
    });

    test('GIVEN plugins THEN keys yields IDs', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();
      await manager.register(plugin);

      const result = Array.from(manager.keys());

      expect(result).toEqual([plugin.getId()]);
    });

    test('GIVEN plugins THEN entries yields ID-plugin pairs', async () => {
      const manager = createManager();
      const plugin = new StubPlugin();
      await manager.register(plugin);

      const result = Array.from(manager.entries());

      expect(result).toHaveLength(1);
      expect(result[0]![0]).toBe(plugin.getId());
      expect(result[0]![1]).toBe(plugin);
    });

    test('GIVEN next THEN returns iterator result', async () => {
      const manager = createManager();
      await manager.register(new StubPlugin());

      const result = manager.next();

      expect(result.done).toBe(false);
    });

    test('GIVEN Symbol.iterator THEN can be iterated', async () => {
      const manager = createManager();
      await manager.register(new StubPlugin());

      const result = Array.from(manager);

      expect(result).toHaveLength(1);
    });
  });
});
