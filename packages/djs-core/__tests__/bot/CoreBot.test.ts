import { EventEmitter } from 'events';
import { describe, expect, expectTypeOf, test, vi } from 'vitest';
import type { Client, MappedEvents } from '@discordjs/core';
import type { APIApplicationCommand } from 'discord-api-types/v10';
import type {
  BotService,
  CommandManager,
  EventBus,
  NyxBot,
  PluginManager,
  ScheduleManager,
} from '@nyx-discord/types';
import {
  DefaultBotService,
  DefaultPluginManager,
  DefaultScheduleManager,
} from '@nyx-discord/base';
import {
  CoreBot,
  DefaultCommandManager,
  type CoreInteractionTypes,
  type CoreNyxClient,
} from '../../src';

function createMockCoreClient() {
  const emitter = new EventEmitter() as Client;
  return {
    getEmitter: () => emitter,
    getApi: () => ({ applicationCommands: {} }),
    getApplicationId: () => '123',
  } as unknown as CoreNyxClient;
}

describe('CoreBot', () => {
  describe('create', () => {
    test('GIVEN default options generator WHEN create is called THEN instantiates bot with default dependencies', () => {
      const client = createMockCoreClient();
      const bot = CoreBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: false,
      }));

      expect(bot).toBeInstanceOf(CoreBot);
      expect(bot.getClient()).toBe(client);
      expect(bot.getCommandManager()).toBeInstanceOf(DefaultCommandManager);
      expect(bot.getScheduleManager()).toBeInstanceOf(DefaultScheduleManager);
      expect(bot.getService()).toBeInstanceOf(DefaultBotService);
      expect(bot.getPluginManager()).toBeInstanceOf(DefaultPluginManager);
      expect(bot.getClientEventBus()).toBeDefined();
      expect(bot.getLogger()).toBe(console);
      expect(bot.getToken()).toBe('test-token');

      expectTypeOf(bot).toExtend<NyxBot<any>>();
      expectTypeOf(bot.getClient()).toEqualTypeOf<CoreNyxClient>();
      expectTypeOf(bot.getCommandManager()).toEqualTypeOf<
        CommandManager<CoreInteractionTypes, MappedEvents, APIApplicationCommand>
      >();
      expectTypeOf(bot.getScheduleManager()).toEqualTypeOf<ScheduleManager>();
      expectTypeOf(bot.getService()).toEqualTypeOf<BotService>();
      expectTypeOf(bot.getPluginManager()).toEqualTypeOf<PluginManager>();
      expectTypeOf(bot.getClientEventBus()).toEqualTypeOf<EventBus<MappedEvents>>();
    });

    test('GIVEN custom injected dependencies WHEN create is called THEN bot uses the injected instances', () => {
      const client = createMockCoreClient();
      interface CustomCommandManager extends CommandManager<CoreInteractionTypes, MappedEvents, APIApplicationCommand> {
        customCommandMethod(): void;
      }
      interface CustomScheduleManager extends ScheduleManager {
        customScheduleMethod(): void;
      }
      interface CustomService extends BotService {
        customServiceMethod(): void;
      }
      interface CustomPluginManager extends PluginManager {
        customPluginMethod(): void;
      }
      interface CustomClientEventBus extends EventBus<MappedEvents> {
        customBusMethod(): void;
      }

      const customCommandManager = {
        deploy: vi.fn(),
        getCommands: vi.fn(),
        addCommands: vi.fn(),
        removeCommands: vi.fn(),
        onStart: vi.fn(),
        onStop: vi.fn(),
        customCommandMethod: vi.fn(),
      } as unknown as CustomCommandManager;
      const customScheduleManager = {
        getSchedules: vi.fn(),
        addSchedule: vi.fn(),
        removeSchedule: vi.fn(),
        onStart: vi.fn(),
        onStop: vi.fn(),
        customScheduleMethod: vi.fn(),
      } as unknown as CustomScheduleManager;
      const customService = {
        start: vi.fn(),
        stop: vi.fn(),
        getStatus: vi.fn(),
        isRunning: vi.fn(),
        getEventBus: vi.fn(),
        customServiceMethod: vi.fn(),
      } as unknown as CustomService;
      const customPluginManager = {
        getPlugins: vi.fn(),
        register: vi.fn(),
        unregister: vi.fn(),
        onStart: vi.fn(),
        onStop: vi.fn(),
        customPluginMethod: vi.fn(),
      } as unknown as CustomPluginManager;
      const customClientEventBus = {
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
        emit: vi.fn(),
        customBusMethod: vi.fn(),
      } as unknown as CustomClientEventBus;

      const bot = CoreBot.create((_bot) => ({
        client,
        token: 'custom-token',
        logger: console,
        deployCommands: false,
        commandManager: customCommandManager,
        scheduleManager: customScheduleManager,
        service: customService,
        pluginManager: customPluginManager,
        clientEventBus: customClientEventBus,
      }));

      expect(bot.getCommandManager()).toBe(customCommandManager);
      expect(bot.getScheduleManager()).toBe(customScheduleManager);
      expect(bot.getService()).toBe(customService);
      expect(bot.getPluginManager()).toBe(customPluginManager);
      expect(bot.getClientEventBus()).toBe(customClientEventBus);

      expectTypeOf(bot.getCommandManager()).toExtend<CustomCommandManager>();
      expectTypeOf(bot.getScheduleManager()).toExtend<CustomScheduleManager>();
      expectTypeOf(bot.getService()).toExtend<CustomService>();
      expectTypeOf(bot.getPluginManager()).toExtend<CustomPluginManager>();
      expectTypeOf(bot.getClientEventBus()).toExtend<CustomClientEventBus>();
    });
  });

  describe('lifecycle', () => {
    test('GIVEN deployCommands is true WHEN bot.start() is called THEN starts service and deploys commands', async () => {
      const client = createMockCoreClient();
      const bot = CoreBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: true,
      }));

      const service = bot.getService();
      const commandManager = bot.getCommandManager();
      vi.spyOn(service, 'start').mockResolvedValue(service);
      vi.spyOn(commandManager, 'deploy').mockResolvedValue(undefined);

      await bot.start();

      expect(service.start).toHaveBeenCalledOnce();
      expect(commandManager.deploy).toHaveBeenCalledOnce();
    });

    test('GIVEN deployCommands is false WHEN bot.start() is called THEN starts service but does not deploy commands', async () => {
      const client = createMockCoreClient();
      const bot = CoreBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: false,
      }));

      const service = bot.getService();
      const commandManager = bot.getCommandManager();
      vi.spyOn(service, 'start').mockResolvedValue(service);
      vi.spyOn(commandManager, 'deploy').mockResolvedValue(undefined);

      await bot.start();

      expect(service.start).toHaveBeenCalledOnce();
      expect(commandManager.deploy).not.toHaveBeenCalled();
    });

    test('GIVEN service fails to start WHEN bot.start() is called THEN propagates error and skips deploy', async () => {
      const client = createMockCoreClient();
      const bot = CoreBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: true,
      }));

      const service = bot.getService();
      const commandManager = bot.getCommandManager();
      const startError = new Error('Service startup failed');
      vi.spyOn(service, 'start').mockRejectedValue(startError);
      vi.spyOn(commandManager, 'deploy').mockResolvedValue(undefined);

      await expect(bot.start()).rejects.toThrow(startError);

      expect(service.start).toHaveBeenCalledOnce();
      expect(commandManager.deploy).not.toHaveBeenCalled();
    });

    test('GIVEN bot is running WHEN bot.stop() is called THEN stops service with provided reason', async () => {
      const client = createMockCoreClient();
      const bot = CoreBot.create((_bot) => ({
        client,
        token: 'test-token',
        logger: console,
        deployCommands: false,
      }));

      const service = bot.getService();
      vi.spyOn(service, 'stop').mockResolvedValue(service);

      await bot.stop('manual-shutdown');

      expect(service.stop).toHaveBeenCalledWith('manual-shutdown');
    });
  });
});
